import { AnyAction as Action } from "redux";
import Article from "../Article";
import ArticleCache from "./ArticleCache";

export default interface ArticleActionCreator {
    getArticles(): any;
    getMoreArticles(earlierThan: string): any;
    createArticle(title: string, content: string, author: string): any;
    editArticle(article: Article): any;
    removeArticle(id: string): any;
    rateArticle(rating: number, id: string, user: string): any;
    setEditCache(id: string, cache: ArticleCache): Action;
    removeEditCache(id: string): Action;
    restoreEditCache(): any;
}