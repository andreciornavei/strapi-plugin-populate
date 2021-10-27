# strapi-plugin-populate

## 🚀 &nbsp; _Overview_

This plugin implements a simple way to populate data relations from the strapi through http requests preventing the needed to create a new controller just to implement this necessity.

**THIS PLUGIN WAS IMPLEMENTED BASED ON STRAPI V3.1.3 AND WAS NOT TESTED FOR OTHER VERSIONS!!!**

---

## ⏳ &nbsp; _Installation_

With npm:
```bash
npm install strapi-plugin-populate
```

With yarn:
```bash
yarn add strapi-plugin-populate
```

---

### ✨ &nbsp; _**POPULATE** Feature_

Now you can pass another type of filter in your query parameters, `_populate`, allowing you to select which field you want to populate from the API.

```bash
GET http://localhost:1337/articles?_populate=author,author.picture
```

Also you can pass it configured in your routes as a `populate` config option, populating the selected fields mandatorily:
```json
{
  "routes": [
    {
      "method": "GET",
      "path": "/articles",
      "handler": "Article.find",
      "config": {
        "policies": [],
        "populate": ["author", "author.picture"]
      }
    }
  ]
}
```

_If you want to avoid default first level populating from strapi core, you can set a `_populate` for an unexistent model relation, like `null`:_

```bash
GET http://localhost:1337/articles?_populate=null
```
_It will return your data with no populate for default first level relations, preventing data overfetchings._

---

## 🎉 &nbsp;  _Congradulations, You're done._

I hope this plugin helps you in your strapi projects and save a lot of time and code.

---
## 📜 &nbsp; _License_

This project is under the MIT license. See the [LICENSE](./LICENSE) for details.

--- 

💻 &nbsp; Developed by André Ciornavei - [Get in touch!](https://www.linkedin.com/in/andreciornavei/)