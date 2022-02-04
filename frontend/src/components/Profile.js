import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import EditProfile from "../components/EditProfile";
import "../css/Profile.css";

export default function Profile({ addAlert, user }) {
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [owner, setOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const params = useParams();

  useEffect(() => {
    updateProfile(params.username);
  }, [params.username, user]);

  function updateFollowing(profile) {
    for (let follower of profile.followers) {
      if (follower.username === user) {
        setFollowing(true);
        return;
      }
    }
    setFollowing(false);
  }

  function updateProfile(username) {
    fetch(`/getProfile?user=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          addAlert({
            variant: "danger",
            message: "That user does not exist.",
          });
          return;
        }
        fetch(`/getPosts?user=${params.username}`)
          .then((res) => res.json())
          .then((posts) => {
            updateFollowing(data[0]);
            setPosts(posts);
            setOwner(user === data[0].username);
            setProfileData(data[0]);
          })
          .catch((err) =>
            addAlert({ variant: "danger", message: err.message })
          );
      })
      .catch((err) => addAlert({ variant: "danger", message: err.message }));
  }

  function followClick() {
    if (!following) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, id: profileData._id }),
      };
      fetch("/addFollower", requestOptions)
        .then((res) => res.json())
        .then((_data) => {
          setFollowing(true);
        })
        .catch((err) => addAlert({ variant: "danger", message: err.message }));
      return;
    }
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, id: profileData._id }),
    };
    fetch("/removeFollower", requestOptions)
      .then((_res) => {
        setFollowing(false);
      })
      .catch((err) => addAlert({ variant: "danger", message: err.message }));
  }

  function hideEditCallback(data) {
    if (data) {
      profileData.first_name = data.first_name;
      profileData.last_name = data.last_name;
      if (data.image_url)
        profileData.photo = { asset: { url: data.image_url } };
      profileData.bio = data.bio;
      setProfileData(profileData);
    }
    setEditing(false);
  }

  if (profileData === {}) return null;

  return (
    <div className="profile">
      <EditProfile
        show={editing}
        hideCallback={hideEditCallback}
        user={user}
        addAlert={addAlert}
        profileData={profileData}
      />
      <div className="profile-banner">
        <h4>@{profileData.username}</h4>
        <div className="profile-data">
          <img
            src={
              profileData.photo
                ? profileData.photo.asset.url
                : "//placehold.it/80"
            }
            id="profile-img"
          />
          <div className="vertical-data">
            <p>
              <strong>Posts</strong>
            </p>
            <h4>{posts ? posts.length : 0}</h4>
          </div>
          <div className="vertical-data">
            <p>
              <strong>Followers</strong>
            </p>
            <h4>{profileData.followers ? profileData.followers.length : 0}</h4>
          </div>
          <div className="vertical-data">
            <p>
              <strong>Following</strong>
            </p>
            <h4>{profileData.following ? profileData.following : 0}</h4>
          </div>
          <div className="follow-button">
            {user && !owner ? (
              <Button
                type="button"
                variant={following ? "danger" : "success"}
                onClick={followClick}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            ) : null}
            {user && owner ? (
              <Button
                type="button"
                variant={"primary"}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : null}
          </div>
        </div>
        <div className="profile-bio">
          <div className="profile-name">
            <strong>
              {(profileData.first_name ? profileData.first_name : "") +
                " " +
                (profileData.last_name ? profileData.last_name : "")}
            </strong>
          </div>
          <div className="profile-text">{profileData.bio}</div>
        </div>
      </div>
      <div className="break"></div>
      <div className="profile-posts-wrapper">
        <div className="profile-posts">
          {posts && posts.length > 0
            ? posts.map((post, idx) => {
                return <img src={post.photo.asset.url} key={idx} />;
              })
            : null}
        </div>
      </div>
    </div>
  );
}
