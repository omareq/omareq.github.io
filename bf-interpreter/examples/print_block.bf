[
c[0] = *    (ASCII 42)
c[1] = LF   (ASCII 10)
c[2] = i loop counter
c[3] = j loop counter
]



+++++ +++++
+++++ +++++
+++++ +++++
+++++ +++++
++          // set c0 to 42 (*)

>           // shift to c1
+++++ +++++ // set c1 to 10 (LF)

>+++++      // c2 = 5

>+++++      // c3 = 5

<           // shift to c2
[
-           // decrement loop counter at c2
>           // shift to c3

[
-           // decrement loop counter at c3
<<<         // shift to c0
.           // print *
>>>         // shift to c3
]
+++++       // set c3 to 5
<<.         // shift to c1 and print
>           // shift to c2
]

[-]         // clear current cell
[
prints a block to the standard output
Created by Omar EQ to test a bf interpreter written in js
https://omareq.github.io/bf-interpreter/ 
]
