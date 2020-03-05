# Hubspot Development Boilerplate

## Table of contents

---

1. [Credits](#markdown-header-credits)
2. [About](#markdown-header-about)
3. [Getting started](#markdown-header-getting-started)
4. [How it works](#markdown-header-how-it-works)
5. [Icons](#markdown-header-icons)
6. [Developing new modules](#markdown-header-developing-new-modules)
7. [PREACT](#markdown-header-preact)
8. [HubDB Tables](#markdown-header-hubdb-tables)
9. [Menu](#markdown-header-menu)
10. [Search](#markdown-header-search)
11. [Blog](#markdown-header-blog)
12. [Hubspot documentation](#markdown-header-hubspot-documentation)

## Credits

---

This boilerplate is based on the [Hubspot Local Development Boilerplate](https://designers.hubspot.com/docs/tools/local-development). The added packages are selected by Linsey Brander & Teun Rutten.

## About

---

This is a starter pack for developing Hubspot projects. The project structure is:

- `/src` folder for all your source files,
- `/dist` folder that is synced with Hubspot.

### Features

- Gulp
- SCSS
- Bundles SVG icons to a single file
- Prettier & ESLint
- Webpack (ES6)

## Getting started

---

### 1. Install Hubspot dependencies

- Install Java.
- Install [Node.js](https://nodejs.org/en/), a Javascript runtime environment that enables the local tools. Versions 8.9.1 or higher of Node are supported, but we recommend the long-term support (LTS) version.
- Install the gulp-cli globally: `yarn global add gulp-cli`

### 2. Install all project dependencies

Run `yarn install` in the project root.

### 3. Setup Hubspot configuration

1. Empty the existing hubspot.config.yml or create a new one with the following command: `touch hubspot.config.yml`
2. Create a private developer app. NOTE: If you select more than the "Content" scope in your apps permissions, your app will not work with this tooling. The app will work with no scopes selected.
3. Run `yarn hubspot:auth` in the command line. This will begin a series of command line prompts.
4. Enter your CMS Portal id.
5. Enter your client id and client secret from your private developer app. This will open a window in your default browser requesting authorization.
6. Select your CMS portal on the authorization page.
7. Request for Integrations Permissions: your private app will request permission to access your account data. Click "Grant Access".
8. If successful, you should see "Authorization Succeeded", and your hubspot.config.yml file will be updated.
9. Add a `name` to the first portal and select a `defaultPortal`:

```
defaultPortal: 'DEV'
portals:
  - name: 'DEV'
    portalId: *******
    authType: oauth2
...

```

## How it works

---

This boilerplate handles the building and deploying of JavaScript, CSS and Hubspot modules. It uses Gulp and Webpack to create minified main.js and main.css files and 'builds' all files in the `/dist` folder. The dist folder is the only folder that is synced with Hubspot, so all files in the project root and in `/src` are for local development. There are a few default commands that can be used in the `package.json`. The main command you need to build and sync files with Hubspot is `yarn deploy`.

### A few comments

- Syncing doesn't delete files in Hubspot
- Create modules local only. _NEVER_ create or edit custom modules in the 'Design Tools' of Hubspot
- Templates are not created locally, you have to create 'Drag and drop' templates in the 'Design Tools' of Hubspot
- You have to connect the `main.css` and `main.js` files to every template you create

### Development flow

To get started with HubSpot development you'll need some commands. These commands will build the CSS and JavaScript and help you automatically sync to HubSpot.

First things first, you'll need to clone the repository like so:

```sh
git clone https://github.com/teunrutten/hubspot-boilerplate.git your-project
```

Change the project name inside the `gulpconfig.js`.
Install all dependencies in the project like so:

```sh
yarn
```

Now you'll need to create a HubSpot Sandbox account via [https://offers.hubspot.com/free-cms-developer-sandbox](https://offers.hubspot.com/free-cms-developer-sandbox). Next up, you'll take note of the portal ID in the url. Search for number which is similiar to this one `7036122`. You replace the portalId inside the `hubspot.config.yml` specifacally for dev with the one you copied. Then, you'll need to generate an API-key, which can be found underneath the _gear_ icon > Integrations > API. Copy the API-key over and place the key in the `hubspot.config.yml` file.

Now, you can use the following commands to kick start you development:

> `yarn watch`
> This command will watch for changes regarding to SCSS, macro's and modules. Each module and macro will be copied over to the dist folder; The dist folder is used to publish to HubSpot.

> `yarn watch:webpack`
> This command will watch for changes regarding to JavaScript. The JavaScript will be transpiled and placed inside the dist folder;

> `yarn hs:watch`
> This command will watch for file changes inside the dist folder. When triggered these files will be uploaded to the HubSpot portal.

You also have some extra commands at your disposal:

> `yarn gen:fields`
> This command can be used for generating HubSpot fields;

> `yarn build:icons`
> This command can be used to build the icons and merge them together in the icons.svg. The icons.svg is later on merged inside the <name>\_icons.module/module.html.

> `yarn gen:module`
> This command can generate a whole module for you.

## Icons

---

Hubspot doesn't allow the upload of SVG files in Design Tools. That's why this boilerplate includes an `Icons` module. The `src/modules/icons.module/module.html` file contains a SVG of all icons in `src/icons`. Add the `Icons` module in the 'Header' section of every template. That way you can use icons like:

```
<svg>
  <use href="#example" xlink:href="#example"></use>
</svg>
```

You can add your SVG icons to `src/icons`. Combining SVG and adding them to the `Icons` module is handled by Gulp.

## Developing new modules

---

Use the command `yarn hubspot:module <name> src/modules` to create a new module. This will create a new folder in the modules folder. This folder contains the following files:

```
/fields.json
/meta.json
/module.css
/module.html
/module.js
```

Don't use the `module.css` and `module.js` files of a module. We only use the `src/js` folder and `src/scss` folder to edit css and javascript. Do **delete the comments** in the `module.css` and `module.js` files, otherwise Hubspot will load them.

**BUG (18 sep 2019)**: Don't leave `module.css` and `module.js` empty (i.e. don't remove the comments), otherwise Hubspot will error when you try to add the module to a page.

You can find a lot of info on modules in [Modules JSON](https://github.com/bradhave94/HubSpot/wiki/Custom-Modules-JSON).

### Settings

Every module contains a `meta.json` file. This file contains properties with settings for the Hubspot module:

```
{
  "css_assets": [ ],
  "external_js": [ ],
  "global": true,
  "help_text": "",
  "host_template_types": [ "PAGE" ],
  "js_assets": [ ],
  "other_assets": [ ],
  "smart_type": "NOT_SMART",
  "tags": [ ],
  "is_available_for_new_content": true
}

```

To be able to use the new module in the Hubspot templates you should edit the `meta.json` file and change `is_available_for_new_content` to `true`.

If you need a global module, you can edit the property `global` and set it to `true`.

If the module may also be used on blog, change `host_template_types` to `[ "PAGE", "BLOG_LISTING", "BLOG_POST" ]`.

### Fields

Each module contains a `fields.json` file. This file contains all the fields a Hubspot user can edit to change the content of the module.

This boilerplate includes various fields utils (`/src/utils`). Create a `/fields/fields.js` file in each module. Use this file to list which utils and custom fields should be used to build up a `fields.json` file (see Gulp `buildModuleFields`).

Example `fields.js`:

```
exports.config = function() {
  return [
    'src/modules/example.module/fields/content.json',
    'src/modules/example.module/fields/image.json',
    'src/utils/fields/padding.json',
    'src/utils/fields/mobile_padding.json'
  ]
}
```

## PREACT

---

First, install the dependencies:

```
yarn add preact
yarn add @babel/plugin-transform-react-jsx --dev
```

Add the react-jsx plugin to .babelrc:

```
{
  "presets": [
    // ...
  ],
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "Preact.h",
      "pragmaFrag": "Preact.Fragment"
    }]
  ]
}

```

Add a new folder in `src/js` for your PREACT app. Example of `src/js/example/index.js`:

```
import { h, render } from 'preact'
import App from './containers/App'

// Tell Babel to transform JSX into h() calls:
/** @jsx h */

const container = document.getElementById('js-example-app')

if ( container ) {
  render( <App />, container )
}
```

Add a new `entry` to webpack.config.js and make sure `output` has `filename: '[name].js'`:

```
module.exports = {
  mode: 'production',
  entry: {
    main: './src/js/main.js',
    example: './src/js/example/',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js')
  },
  // ...
}
```

Don't forget to add the new javascript file to your template in HubSpot.

### File conflicts

Make sure your website does **not** load `theme-foundation.js`! This file prevents PREACT from working correctly.

### Make GET requests

- Get table data and columns: https://api.hubapi.com/hubdb/api/v2/tables/{tableId}?portalId={portalId}
- Get table rows: https://api.hubapi.com/hubdb/api/v2/tables/{tableId}/rows?portalId={portalId}
- Make sure the table is _publicly queryable_. You do this per table in Settings > Allow public API access.
- IE11 fix: Add `whatwg-fetch` to package.json to add support for `fetch`.

### Documentation

- [Hubspot Documentation: Get table](https://developers.hubspot.com/docs/methods/hubdb/v2/get_table)
- [Hubspot Documentation: Get table rows](https://developers.hubspot.com/docs/methods/hubdb/v2/get_table_rows)

## HubDB Tables

---

#### Creating a table

Navigate to Marketing > Files and templates > HubDB to create a table. Add some columns and fill in some rows.

#### Looping through a table

Create a module and then loop through the table rows in the `module.html`.

For example, we have a Cases table (ID: 1667842). The table has 4 columns: id, name, image and url.

```
{% set cases = hubdb_table_rows('1667842') %}

{% for case in cases %}
  <div>
    <img src="{{case.image.url}}" alt="{{case.image.alt}}"/>
    <p>{{case.name}}</p>
    <a href="{{case.url}}">Read more</a>
  </div>
{% endfor %}
```

Instead of hard-coding, you can also let users choose a table by adding a `hubdbtable` field:

```
{
  "name" : "table_id",
  "label" : "Tabel",
  "type" : "hubdbtable"
}
```

## Menu

---

#### Create one or multiple menus in Hubspot

Navigate to Settings > Website > Navigation to create a menu.

Choose "Add item without link" for items that'll have a dropdown. We will use this to check in our `module.html` if an menu item has children or not (`if item.url`).

#### Create a menu module field.

In your module, create a field that allows users to pick one menu:

```
{
  "name" : "menu_id",
  "label" : "Menu",
  "type" : "menu",
  "default" : 12181326389 //optional default menu id
}
```

#### Loop through the menu items in `module.html`

```
<div>
  {% set node = menu(menu_id) %}

  {% for item in node.children %}
    {% set current = item.activeNode ? 'current' : '' %}
    {% set currentParent = item.activeBranch ? 'current' : '' %}

    {% if item.url %}
      <a href="{{item.url}}" class="{{current}}">
        {{item.label}}
      </a>

    {% else %}
      <div class="{{current}} {{currentParent}}">
        <span>{{item.label}}</span>
        <div>
          {% for child in item %}
            {% set currentChild = child.activeNode ? 'current' : '' %}

            <a href="{{child.url}}" class="{{currentChild}}">
              {{child.label}}
            </a>
          {% endfor %}
        </div>
      </div>

    {% endif %}
  {% endfor %}
</div>
```

## Search

---

#### Search results module

Create a new module and call it search_results or something. Add to `module.html`:

```
<div id="js-search-app" ></div>
```

You could pass data from your module to the app if you'd like. For example:

```
<div
  id="js-search-app"
  data-language="{{module.language}}"
  data-placeholder="{{module.search.placeholder}}"
  data-none="{{module.search.no_results}}"
  data-pathprefix="{{module.search.path_prefix}}"
></div>
```

#### Search results app

First, [add PREACT](#markdown-header-preact) and create a folder for your search app.

Make a GET request to the [Hubspot Search API](https://developers.hubspot.com/docs/methods/content/search-for-content):

```
fetch(`https://api.hubapi.com/contentsearch/v2/search?portalId=${portalId}&term=${searchTerm}`)
.then(
  // handle the response
).catch(
  // handle errors
)
```

The response will look something like this:

```
{
  "total": 20,
  "offset": 0,
  "limit": 9,
  "results": [
    {
      "id": 123456789,
      "score": 0.017206732,
      "type": "SITE_PAGE",
      "domain": "www.example.com",
      "url": "https://www.example.com/lorem",
      "language": "nl-nl",
      "title": "Example post title",
      "description": "Lorem ipsum <span class=\"hs-search-highlight hs-highlight-html\">dolor</span> iset amet."
    },
    {
      // ...another result
    },
    {
      // ...another result
    }
  ]
}
```

The `portalId` and `term` are required fields. You can pass additional parameters like offset, limit, pathPrefix, language, etc. [Check the docs](https://developers.hubspot.com/docs/methods/content/search-for-content).

The `pathPrefix` parameter helps you limit search to parts of your website. It "specifies a path prefix to filter search results. Will only return results with URL paths that start with the specified parameter. Can be used multiple times." [source](https://developers.hubspot.com/docs/methods/content/search-for-content)

#### Search form

You can create a search form in your app and set the search term from there. For example:

```
<form onSubmit={this.handleSubmit}>
  <input
    type="search"
    placeholder="Search..."
    value={this.state.searchTerm}
    onChange={this.handleSearch}
  />
  <input type="submit" value="search" />
</form>

// ...

handleSearch(searchTerm) {
  this.setState({
    searchTerm: searchTerm,
  })
}

handleSearchSubmit() {
  this.setState({
    posts: [],
    offset: 0
  }, this.fetchPosts )
}
```

Or create a search_form module and pass the data to your app. For example:

```
<form method="GET" action="/search-results">
  <input
    type="search"
    name="ss"
    placeholder="Search..."
    value=""
  />
  <input
    type="submit"
    value="Send"
  />
</form>
```

The action can be any page as long as that page contains the search_results module (step 1). Then, check for url params in the search app:

```
componentDidMount() {
  let urlParams = new URLSearchParams(window.location.search)

  if ( urlParams.has('ss') ) {
    this.setState({
      searchTerm: urlParams.get('ss')
    }, this.fetchPosts )

  } else {
    this.fetchPosts()
  }
}
```

## Blog

---

#### Creating a blog listing module

Create a new module and name it 'blog_listing' or something.

In `meta.json` set `host_template_types` to `[ "BLOG_LISTING" ]`.

Loop through `contents` in `module.html` to show posts. For example:

```
{% for content in contents %}
  <div>
    <a href="{{content.absolute_url}}">
      {{ content.name }}
    </a>
    {% if content.post_list_summary_featured_image %}
      <img src="{{ content.post_list_summary_featured_image }}" alt="{{ content.featured_image_alt_text | escape }}" />
    {% endif %}
    {% for topic in content.topic_list %}
      <a href="{{ blog_tag_url(group.id, topic.slug) }}">{{ topic.name }}</a>{% if not loop.last %}, {% endif %}
    {% endfor %}
    {% if content.blog_post_author %}
      <a href="{{ blog_author_url(group.id, content.blog_post_author.slug) }}">
        {{ content.blog_post_author.display_name }}
      </a>
    {% endif %}
  </div>
{% endfor %}
```

You can loop through the tags with `blog_tags()`:

```
{% set tags = blog_tags('default', 250) %}

{% for item in tags %}
  {% set current = item.slug in content.absolute_url ? 'current' : '' %}
  <a href="{{ blog_tag_url(group.id, item.slug) }}" class="tag {{current}}">{{ item }}</a>
{% endfor %}
```

An example of pagination:

```
{% if not simple_list_page %}
  <div>
    {% if last_page_num %}
      <a class="prev" href="{{ blog_page_link(last_page_num) }}">Previous</a>
    {% endif %}
      <a class="all" href="{{ blog_all_posts_url(group.id) }}">All posts</a>
    {% if next_page_num %}
      <a class="next" href="{{ blog_page_link(next_page_num) }}">Next</a>
    {% endif %}
  </div>
{% endif %}
```

`simple_list_page` is true if a user clicks the 'all posts' link.

You can use `blog_author` to check if we're on an author archive page:

```
{% if blog_author %}
  <div>
    {% if blog_author.avatar %}
      <img src="{{ blog_author.avatar }}" alt="{{ blog_author.display_name }}">
    {% endif %}
    <h3>{{ blog_author.display_name }}</h3>
    <p>{{ blog_author.bio }}</p>
  </div>
{% endif %}
```

You can also create a blog module field.json:

```
{
	"name" : "blog_id",
	"label" : "Blog",
	"type" : "blog"
}
```

**Tip:** You can check Hubspot's own Blog Content module for inspiration.

#### Creating blog post modules

You can create one big module for a single post or break it up in multiple modules (hero, content, similar posts, etc). But always set `host_template_types` to `[ "BLOG_POST" ]` in the `meta.json`.

To print the post content, you need to use:

```
{{ content.post_body }}
```

To print the title, date, topics, author and featured image:

```
<h1>{{ content.name }}</h1>

<span>{{ content.publish_date_localized }}</span>

{% if content.topic_list %}
  {% for topic in content.topic_list %}
    <a href="{{ blog_tag_url(group.id, topic.slug) }}">{{ topic.name }}</a>{% if not loop.last %}, {% endif %}
  {% endfor %}
{% endif %}

{% if content.blog_post_author.avatar %}
<img src="{{ content.blog_post_author.avatar }}" />
{% endif %}

<a href="{{ group.absolute_url }}/author/{{ content.blog_post_author.slug }}">
  {{ content.blog_post_author.display_name }}
</a>

{% if content.featured_image %}
  <img src="{{ content.featured_image }}" />
{% endif %}
```

To get similar posts (i.e. in the same topic):

```
{% set tag_posts = blog_recent_tag_posts('default', content.topic_list[0].slug, 3) %}

{% for post in tag_posts %}
  <h2>{{ post.name }}</h2>
{% endfor %}
```

**Tip:** You can check Hubspot's own Blog Content module for inspiration.

#### Creating blog templates on Hubspot

Navigate to Marketing > Files and Templates > Design Tools.

Create a new blog template and name it Blog Listing or something. Add your blog listing module to the new template (and any other modules, such as header and footer).

Then, create another blog template and name it Blog Post or something. Add your blog post module(s) to the new template.

#### Creating a blog on Hubspot

Navigate to Settings > Website > Blog and click "Create new blog". Choose a Blog root URL in the General tab. Next, go to the Templates tab and choose the templates we just made.

The blog won't show until you have at least one post.

## Hubspot documentation

---

### Hubspot

- [Module fields](https://github.com/bradhave94/HubSpot/wiki/Custom-Modules-JSON)
- [Hubl function](https://designers.hubspot.com/en/docs/hubl/hubl-supported-functions)
- [Hubl variables](https://designers.hubspot.com/docs/hubl/hubl-supported-variables)
- [Hubl tags](https://designers.hubspot.com/docs/hubl/hubl-supported-tags)
- [Hubl filters](https://designers.hubspot.com/docs/hubl/hubl-supported-filters)
- [Local module developement](https://designers.hubspot.com/docs/tools/local-module-development)

### Hubspot: Menu

- [Menu module field](https://github.com/bradhave94/HubSpot/wiki/Custom-Modules-JSON#menu)
- [Menu functions](https://designers.hubspot.com/en/docs/hubl/hubl-supported-functions#menu)
- [Menu node variables](https://designers.hubspot.com/docs/hubl/hubl-supported-variables#menu-node-variables)

### Hubspot: Search

- [Site Search API](https://developers.hubspot.com/docs/methods/content/search-for-content)
- [Search Results page](https://knowledge.hubspot.com/articles/kcs_article/cos-general/how-do-i-set-up-a-results-page-for-my-search-field-in-hubspot)

### Hubspot: Table

- [Get table](https://developers.hubspot.com/docs/methods/hubdb/v2/get_table)
- [Get table rows](https://developers.hubspot.com/docs/methods/hubdb/v2/get_table_rows)

### Hubspot: Blog

- [Blog content markup](https://designers.hubspot.com/docs/hubl/blog-content-markup)
