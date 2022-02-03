export default {
  title: "Post",
  name: "post",
  type: "document",
  fields: [
    {
      title: "Photo",
      name: "photo",
      type: "image",
      required: true,
    },
    {
      title: "Description",
      name: "description",
      type: "text",
      required: true,
    },
    {
      title: "Created At",
      name: "created_at",
      type: "datetime",
      required: true,
    },
    {
      title: "Author",
      name: "author",
      type: "reference",
      to: [{ type: "user" }],
      required: true,
    },
  ],
};
