# Brick breaker

A quick brick breaker game

Check out the [Demo](https://omareq.github.io/brick-breaker/).

Check out the [Docs](https://omareq.github.io/brick-breaker/docs/).

Created using [p5.js](https://p5js.org/)

## Levels

When this game was initially created only 2 levels existed.  However given how
easy it is too add a new level I encourage pull requests with new level designs.

The current format is to submit a 2D array of objects that describe a 16 column
by 8 row brick layout.  Each object contains two variables ```width``` and
```hits```.  The ```width``` describes how many columns that brick will take up.
The ```hits``` describes how many times that brick needs to be hit by a ball
before it is destroyed.

```js
{width: 2, hits: 1}
```

The arrangement of these objects is in a 2D array starting from the top left
corner of the canvas.  Each row in the array represents a new row of bricks.
This can be seen below.  Pay attention to the usage of 0 hit bricks as spacers.
This will allow for more flexibility in level design.

```js
/**
 * The layout of the bricks in the example
 *
 * @type       {Array<Array<Object>>}
 */
let exampleLayout = [
    [{width: 16, hits: 0}], // blank row
    [{width: 16, hits: 1}],
    [{width: 4, hits: 0}, {width: 8, hits: 2}, {width: 4, hits: 0}],
    [{width: 4, hits: 0}, {width: 4, hits: 3}, {width: 4, hits: 3}], // row is only 12 cols wide
    [{width: 16, hits: 0}]  // blank row
];
```

It is important to note that the number of cols and rows defined does not need
to reach 16 x 8.  The parser will still be able to construct the level.  The
colour of the bricks is determined by how many hits it takes to destroy the
brick.  This is determined up to 5 hits, after that the default colour is
purple.

![Example layout](https://omareq.github.io/brick-breaker/imgs/example-layout.png)

Finally place the layout at the bottom of the level.js file and add it to the
```levelLayouts``` array.  Don't forget to update the readme with your awesome
new level design/

```js
/**
 * An array of all level layouts.
 *
 * @type       {Array}
 */
let levelLayouts = [
    layout0,
    layout1,
    layout2,
    layout3
];
````

### Level 1

Author: [@omareq](https://github.com/omareq)

![Image showing the layout of the bricks in level 0](https://omareq.github.io/brick-breaker/imgs/layout0.png)

### Level 2

Author: [@omareq](https://github.com/omareq)

![Image showing the layout of the bricks in level 1](https://omareq.github.io/brick-breaker/imgs/layout1.png)

### Level 3

Author:  Naomi

![Image showing the layout of the bricks in level 2](https://omareq.github.io/brick-breaker/imgs/layout2.png)

### Level 4

Author:  Naomi

![Image showing the layout of the bricks in level 3](https://omareq.github.io/brick-breaker/imgs/layout3.png)

## License

This repository is protected under the [GPL v3](https://www.gnu.org/licenses/gpl-3.0.html) license.

## Contact Details
__Programmer:__ Omar Essilfie-Quaye [omareq08+githubio@gmail.com](mailto:omareq08+githubio@gmail.com?subject=Githubio%20Brick%20Breaker%20Game)


(This is an auto-generated document, not all links will necessarily work)