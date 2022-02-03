export default {
  title: "User",
  name: "user",
  type: "document",
  fields: [
    {
      title: "first_name",
      name: "first_name",
      type: "string",
      required: true,
    },
    {
      title: "last_name",
      name: "last_name",
      type: "string",
      required: true,
    },
    {
      title: "username",
      name: "username",
      type: "string",
      required: true,
      unique: true,
      validation: (Rule) => [
        Rule.required()
          .min(5)
          .error("A username of min. 5 characters is required"),
        Rule.max(25).warning("Username cannot be longer than 25 characters."),
        Rule.unique(),
      ],
    },
    {
      title: "Photo",
      name: "photo",
      type: "image",
    },
    {
      title: "Bio",
      name: "bio",
      type: "text",
    },
    {
      title: "Following",
      name: "following",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "user" }],
          validation: (Rule) => Rule.unique(),
        },
      ],
    },
    {
      title: "Updated At",
      name: "updated_at",
      type: "datetime",
    },
    {
      title: "created_at",
      name: "created_at",
      type: "datetime",
      required: true,
    },
  ],
};
