import { useEffect } from 'react';
import { NEWS_KEY } from '@env';
const timer = 1000 * 60 * 5; // 5 minutes

export function useFetchNews(loading, setLoading, setNewsArticles) {
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  useEffect(() => {
    if (loading) {
      console.log('loading news');
      fetch(
        `https://newsapi.org/v2/everything?q=bitcoin&from=${date}&sortBy=publishedAt&apiKey=${NEWS_KEY}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const articles = data.articles
            .map((article, index) => {
              return {
                tittle: article.title,
                paragraph: article.description,
                image_url: article.urlToImage,
                url: article.url,
                isFav: true,
                id: index,
              };
            })
            .slice(0, 10);
          setNewsArticles(articles);
          setLoading(false);
          console.log(articles);
        })
        .catch((error) => console.error(error));
    }
    const interval = setInterval(() => {
      console.log('fetching in interval');
      fetch(
        `https://newsapi.org/v2/everything?q=bitcoin&from=${date}&sortBy=relevancy&language=en&pageSize=10&apiKey=${NEWS_KEY}&page=1`,
      )
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }, timer);
    return () => clearInterval(interval);
  }, []);
}
