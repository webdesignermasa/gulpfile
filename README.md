# gulpfile

gulpfile.jsとWebサイト用のファイル一式です。
Dart Sassに対応し、@use を使用、@import は使用していません。
Node.jsは v16.13.0 で動作を確認しています。

## sassフォルダ

sassフォルダの下は

```
@use "../../functions" as f;
@use "../../mixin"as mx;
```

として、フォルダごとに @use します。（variablesフォルダ以外）

---

使用するときは

```
.sample {
  font-size: f.rem(24);

  @include mx.mq('pc') {
    font-size: f.rem(32);
  }
}
```

のようにネームスペースをつけます。

## variablesフォルダ

variablesフォルダは

```
@use "../../variables/color";
@use "../../variables/font";
@use "../../variables/weight";
```

として、個別に @use します。

---

使用するときは

```
.sample {
  background: color.$base;
  font-weight: weight.$bold;
  color: color.$text;
}
```

のように、ファイル名をネームスペースとして使用します。

## フォルダ構成

```
/
├── README.md
├── dist
│   ├── css
│   │   ├── reset.css
│   │   └── style.css
│   ├── img
│   ├── index.html
│   └── js
│       ├── script.js
│       └── script.min.js
├── gulpfile.js
├── package.json
└── src
    ├── img
    ├── index.html
    ├── js
    │   └── script.js
    └── sass
        ├── base
        │   ├── _base.scss
        │   └── _index.scss
        ├── components
        │   └── _index.scss
        ├── functions
        │   ├── _functions.scss
        │   └── _index.scss
        ├── layout
        │   ├── _index.scss
        │   └── _l-inner.scss
        ├── mixin
        │   ├── _index.scss
        │   └── _media-query.scss
        ├── project
        │   ├── _index.scss
        │   └── top
        │       ├── _index.scss
        │       └── _p-top-title.scss
        ├── reset.scss
        ├── style.scss
        ├── utility
        │   ├── _hidden.scss
        │   └── _index.scss
        └── variables
            ├── _color.scss
            ├── _font.scss
            ├── _inner.scss
            └── _weight.scss
```
