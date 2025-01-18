function mandelbrot(x, y, maxSteps, threshold) {
    let c = math.complex(x, y);
    let itt = 1;
    let z = c;

    while(itt < maxSteps && z.mul(z.conjugate()).re < threshold) {
        z = z.mul(z).add(c);
        itt ++;
    }
    return itt;
}
