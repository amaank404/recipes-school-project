import { SearchParams } from "../repository/types";
import { SearchData } from "../ui/input/search_side_bar";

export default function searchDataToQuery(searchData: SearchData | undefined) {
    let query: SearchParams = {
      query: [],
    };
  
    if (searchData === undefined) {
      return query;
    }
  
    if (searchData) {
      let catArr = [];
      for (let x of searchData.categories) {
        catArr.push(x.toLowerCase());
      }
  
      if (catArr.length)
        query.query.push(["contains", "recipes.base", ...catArr]);
      if (searchData.tags.size)
        query.query.push(["contains", "tags.tag", ...searchData.tags]);
      if (searchData.search.trim().length)
        query.query.push(["search", "recipes.name", searchData.search.trim()]);
    }
  
    return query;
  }