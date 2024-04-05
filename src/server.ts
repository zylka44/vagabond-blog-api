import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Article, Session } from './mongoCofig';
import { parseArticle } from './helpers';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('tuitam is working');
});

app.get('/session/', async (req, res) => {
  try {
    const session = await Session.find({});
    const { credentials } = session[0];
    res.send({ credentials });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/session/', async (req, res) => {
  try {
    const { password } = req.body;
    const session = await Session.find({});
    const { credentials } = session[0];
    const isValid = password === credentials;
    res.send(isValid);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/articles/', async (req, res) => {
  try {
    const articles = await Article.find({});
    const parsedArticles = articles.map((article) => {
      const { title, date, mainPictureUrl, publication } = article;
      return { id: article._id.toString(), title, date, mainPictureUrl, publication };
    });
    res.send(parsedArticles);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    const parsedArticle = parseArticle(article);
    res.send(parsedArticle);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/articles', async (req, res) => {
  try {
    const title = req.body;
    const article = new Article(title);
    await article.save();
    res.send(article);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    Object.assign(article, req.body);
    article.save();
    const parsedArticle = parseArticle(article);
    res.send(parsedArticle);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/articles/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    await article.remove();
    res.send(id);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/filteredArticles', async (req, res) => {
  try {
    const { filteringText, selectedTripTypes } = req.body;
    const articles = await Article.find({ title: { $regex: filteringText, $options: 'i' } });
    const articlesOfSelectedTripType =
      selectedTripTypes?.length > 0
        ? articles.filter((article) => {
            const articleTags = article.publication.tags.split(',');
            return articleTags.some((tag) => selectedTripTypes.includes(tag));
          })
        : articles;
    const filteredArticlesIds = articlesOfSelectedTripType.map((article) => article._id);
    res.send(filteredArticlesIds);
  } catch (error) {
    res.status(400).send(error);
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`api is running on port ${port}`);
});
