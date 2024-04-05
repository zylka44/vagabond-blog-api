export const parseArticle = (article) => {
  const { title, chunks, date, publication, mainPictureUrl } = article;
  const parsedChunks = chunks.map((chunk) => {
    const { _id, type, text, pictures, info } = chunk;
    const parsedPictures = pictures.map((picture) => {
      const { _id, url, description, location } = picture;
      return { id: _id.toString(), url, description, location };
    });
    return { id: _id.toString(), type, text, pictures: parsedPictures, info };
  });
  return { id: article._id.toString(), title, chunks: parsedChunks, date, publication, mainPictureUrl };
};
