import { type News } from '@/types';

class NewsPreloader {
  private news: { [key: number]: News } = {};

  constructor() {
    this.news = {};
  }

  async getNews(newsId: number): Promise<News> {
    if (this.news[newsId]) {
      return this.news[newsId];
    }
    const news = await this.fetchNews(newsId);
    this.news[newsId] = news;
    return news;
  }

  async fetchNews(newsId: number): Promise<News> {
    const res = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${newsId}.json?print=pretty`,
    );
    const hnNews = await res.json();
    const hnUrl =
      hnNews.url || `https://news.ycombinator.com/item?id=${newsId}`;
    const news = await fetch(
      `https://huehive.co/api/v1/hn_article_summaries/summarize?hn_id=${hnNews.id}&article_url=${hnUrl}&title=${hnNews.title}&author=${hnNews.by}&score=${hnNews.score}`,
    ).then((res) => res.json());
    if (!news.title) {
      console.log(
        `https://huehive.co/api/v1/hn_article_summaries/summarize?hn_id=${hnNews.id}&article_url=${hnUrl}&title=${hnNews.title}&author=${hnNews.by}&score=${hnNews.score}`,
      );
    }
    news.by = hnNews.by;
    news.id = newsId;
    news.descendants = hnNews.descendants;
    return news;
  }

  clear(): void {
    this.news = {};
  }
}

const newsPreloader = new NewsPreloader();

export default newsPreloader;
