import { NEWS_KEY } from '@env';
import { useEffect } from 'react';
const timer = 1000 * 60 * 5; // 5 minutes

export function useFetchNews(loading, setLoading, setNewsArticles, page) {
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  const pageSize = 10;
  useEffect(() => {
    if (loading) {
      console.log('loading news');
      fetch(
        `https://newsapi.org/v2/everything?q=bitcoin&from=${date}&sortBy=popularity&pageSize=${pageSize}&apiKey=${NEWS_KEY}&page=${page}&language=en`,
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
                id: `${index}${article.title}`,
              };
            })
            .slice(0, 10);
          setNewsArticles((prev) => [...prev, ...articles]);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [page]);
}
