import sanityClient from "./client.js";
import { basename } from "path";
import { createReadStream } from "fs";

const functions = {};

functions.getPosts = (username) => {
  return sanityClient.fetch(
    `*[_type == "post" && author->username == "${username}"]{
        ...,
        "username": author->username,
        photo{
          asset->{
          _id,
          url
        }
      }
    }`
  );
};

functions.searchForUsername = (text) => {
  return sanityClient.fetch(
    `*[_type == "user" && username match "${text}*"]{
        ...,
        "followers": count(*[_type == "user" && references(^._id)]),
        photo{
            asset->{
            _id,
            url
          }
        }
      }`
  );
};

functions.getUserId = (username) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == "${username}"]{
         _id
    }`
  );
};

functions.getProfile = (username) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == "${username}"]{
          ...,
          "following": count(following),
          "followers": *[_type == "user" && references(^._id)],
          photo{
            asset->{
            _id,
            url
          }
        }
      }`
  );
};

functions.getAllPosts = () => {
  return sanityClient.fetch(
    `*[_type == "post"] | order(created_at) {
      ...,
      "username": author->username,
      photo{
        asset->{
        _id,
        url
      }
    }
  }`
  );
};

functions.getPostsOfFollowing = (username) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == "${username}"]{
      following[]->{
        "posts": *[_type == "post" && references(^._id)] {
          ...,
          "username": author->username,
          photo{
            asset->{
            _id,
            url
          }
        }
      }
      }
    }
  `
  );
};

functions.createUser = (firstName, lastName, username) => {
  return sanityClient.create({
    _type: "user",
    first_name: firstName,
    last_name: lastName,
    username: username,
    created_at: new Date(),
  });
};

functions.createPost = (user, description, image) => {
  return sanityClient.assets
    .upload("image", createReadStream(image.path), {
      filename: basename(image.path),
    })
    .then((data) =>
      functions.getUserId(user).then((ids) => {
        return sanityClient.create({
          _type: "post",
          author: { _ref: ids[0]._id },
          photo: { asset: { _ref: data._id } },
          description: description,
          created_at: new Date(),
        });
      })
    );
};

functions.updateProfile = (user, updates, image) => {
  if (image) {
    return sanityClient.assets
      .upload("image", createReadStream(image.path), {
        filename: basename(image.path),
      })
      .then((data) =>
        functions.getUserId(user).then((ids) =>
          sanityClient
            .patch(ids[0]._id)
            .set({
              ...updates,
              photo: { asset: { _ref: data._id } },
            })
            .commit()
        )
      );
  } else {
    return functions
      .getUserId(user)
      .then((ids) => sanityClient.patch(ids[0]._id).set(updates).commit());
  }
};

functions.addFollower = (user, followingId) => {
  return functions.getUserId(user).then((ids) =>
    sanityClient
      .patch(ids[0]._id)
      .setIfMissing({ following: [] })
      .insert("after", "following[-1]", [{ _ref: followingId }])
      .commit()
  );
};

functions.removeFollower = (user, followingId) => {
  return functions.getUserId(user).then((ids) =>
    sanityClient
      .patch(ids[0]._id)
      .unset([`following[_ref=="${followingId}"]`])
      .commit()
  );
};

export default functions;
