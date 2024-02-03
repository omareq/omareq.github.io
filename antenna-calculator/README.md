# Antenna Dimensions Calculator

I have been making antennas for a while now and I have realised that I have
gotten into the bad habit of actually doing the same calculation to get the
dimensions over and over again.  Obviously I should know better by now.  Anyway
I decided to write up the calculations very quickly and then to make a quick
animation of the results.

Checkout the [Demo](https://omareq.github.io/antenna-calculator/).

Checkout the [Docs](https://omareq.github.io/antenna-calculator/docs).

Animations created using [p5.js](https://p5js.org/)

## To do list

#### General

- [ ]   Add toggle to hide or show dimensions

- [ ]   Add current frequency indicator in top left corner of diagram

- [ ]   Create schematic export to pdf or some other format

- [ ]   Add inverse calculation, ie antenna frequency from dimensions

- [ ]   Add reflection from transmission line calculation

#### Bi-Quad

- [ ]   Add animation

- [ ]   Add Impedance and Gain

#### Dipole

- [x]   Add dimensions to drawing

#### Folded Dipole

- [ ]   Add Gain

#### Helical

- [ ]   Figure out why the first and last vertex of the helix are connected

- [ ]   Figure out how to pause animation when active tab is changed

- [ ]   Add HPBW (Half Power Beam Width) or transmission diagram

- [ ]   Draw reflector dish

- [ ]   Update animations to show dimensions of antenna

- [ ]   Create stop animation option that displays static image with dimensions

#### Turnstile

- [ ]   Add animation

- [x]   Add dimensions to drawing

#### Yagi-Uda

- [ ]   Just do it (__tick__)


## Impedance Gain List

| Antenna        | Impedance (ohm)    | Gain (dB)             |
|----------------|--------------------|-----------------------|
| Bi Quad        | 61                 | 10 - 12               |
| Dipole         | 73 Requires Balun  | 2.1                   |
| Folded Dipole  | 292                | 2.1                   |
| Helical        | 140                | Depends on Turns      |
| Turnstile      | 36                 | Approx 3dB < dipole   |
| Yagi-Uda       | Driven Element     | Parasitic Elements    |

## License

This repository is protected under the [GPL v3](https://www.gnu.org/licenses/gpl-3.0.html) license.

## Contact Details

__Programmer:__ Omar Essilfie-Quaye [omareq08+githubio@gmail.com](mailto:omareq08+githubio@gmail.com?subject=Omar%20EQ%20Github%20Pages%20-%20Antenna%20Calculator%20Project)

(This is an auto-generated document, not all links will necessarily work)
