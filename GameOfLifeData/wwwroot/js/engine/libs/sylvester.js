// === Sylvester ===
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
var Sylvester = {version:"0.1.3", precision:1.0E-6};
function Vector() {
}
Vector.prototype = {e:function (a) {
    return a < 1 || a > this.elements.length ? null : this.elements[a - 1]
}, dimensions:function () {
    return this.elements.length
}, modulus:function () {
    return Math.sqrt(this.dot(this))
}, eql:function (a) {
    var b = this.elements.length;
    a = a.elements || a;
    if (b != a.length)return false;
    do if (Math.abs(this.elements[b - 1] - a[b - 1]) > Sylvester.precision)return false; while (--b);
    return true
}, dup:function () {
    return Vector.create(this.elements)
}, map:function (a) {
    var b = [];
    this.each(function (c, d) {
        b.push(a(c, d))
    });
    return Vector.create(b)
},
    each:function (a) {
        var b = this.elements.length, c = b, d;
        do {
            d = c - b;
            a(this.elements[d], d + 1)
        } while (--b)
    }, toUnitVector:function () {
        var a = this.modulus();
        if (a === 0)return this.dup();
        return this.map(function (b) {
            return b / a
        })
    }, angleFrom:function (a) {
        var b = a.elements || a;
        if (this.elements.length != b.length)return null;
        var c = 0, d = 0, e = 0;
        this.each(function (f, g) {
            c += f * b[g - 1];
            d += f * f;
            e += b[g - 1] * b[g - 1]
        });
        d = Math.sqrt(d);
        e = Math.sqrt(e);
        if (d * e === 0)return null;
        a = c / (d * e);
        if (a < -1)a = -1;
        if (a > 1)a = 1;
        return Math.acos(a)
    }, isParallelTo:function (a) {
        a =
            this.angleFrom(a);
        return a === null ? null : a <= Sylvester.precision
    }, isAntiparallelTo:function (a) {
        a = this.angleFrom(a);
        return a === null ? null : Math.abs(a - Math.PI) <= Sylvester.precision
    }, isPerpendicularTo:function (a) {
        a = this.dot(a);
        return a === null ? null : Math.abs(a) <= Sylvester.precision
    }, add:function (a) {
        var b = a.elements || a;
        if (this.elements.length != b.length)return null;
        return this.map(function (c, d) {
            return c + b[d - 1]
        })
    }, subtract:function (a) {
        var b = a.elements || a;
        if (this.elements.length != b.length)return null;
        return this.map(function (c, d) {
            return c - b[d - 1]
        })
    }, multiply:function (a) {
        return this.map(function (b) {
            return b * a
        })
    }, x:function (a) {
        return this.multiply(a)
    }, dot:function (a) {
        a = a.elements || a;
        var b = 0, c = this.elements.length;
        if (c != a.length)return null;
        do b += this.elements[c - 1] * a[c - 1]; while (--c);
        return b
    }, cross:function (a) {
        a = a.elements || a;
        if (this.elements.length != 3 || a.length != 3)return null;
        var b = this.elements;
        return Vector.create([b[1] * a[2] - b[2] * a[1], b[2] * a[0] - b[0] * a[2], b[0] * a[1] - b[1] * a[0]])
    }, max:function () {
        var a = 0, b = this.elements.length,
            c = b, d;
        do {
            d = c - b;
            if (Math.abs(this.elements[d]) > Math.abs(a))a = this.elements[d]
        } while (--b);
        return a
    }, indexOf:function (a) {
        var b = null, c = this.elements.length, d = c, e;
        do {
            e = d - c;
            if (b === null && this.elements[e] == a)b = e + 1
        } while (--c);
        return b
    }, toDiagonalMatrix:function () {
        return Matrix.Diagonal(this.elements)
    }, round:function () {
        return this.map(function (a) {
            return Math.round(a)
        })
    }, snapTo:function (a) {
        return this.map(function (b) {
            return Math.abs(b - a) <= Sylvester.precision ? a : b
        })
    }, distanceFrom:function (a) {
        if (a.anchor)return a.distanceFrom(this);
        var b = a.elements || a;
        if (b.length != this.elements.length)return null;
        var c = 0, d;
        this.each(function (e, f) {
            d = e - b[f - 1];
            c += d * d
        });
        return Math.sqrt(c)
    }, liesOn:function (a) {
        return a.contains(this)
    }, liesIn:function (a) {
        return a.contains(this)
    }, rotate:function (a, b) {
        var c, d, e, f;
        switch (this.elements.length) {
            case 2:
                c = b.elements || b;
                if (c.length != 2)return null;
                d = Matrix.Rotation(a).elements;
                e = this.elements[0] - c[0];
                f = this.elements[1] - c[1];
                return Vector.create([c[0] + d[0][0] * e + d[0][1] * f, c[1] + d[1][0] * e + d[1][1] * f]);
            case 3:
                if (!b.direction)return null;
                var g = b.pointClosestTo(this).elements;
                d = Matrix.Rotation(a, b.direction).elements;
                e = this.elements[0] - g[0];
                f = this.elements[1] - g[1];
                c = this.elements[2] - g[2];
                return Vector.create([g[0] + d[0][0] * e + d[0][1] * f + d[0][2] * c, g[1] + d[1][0] * e + d[1][1] * f + d[1][2] * c, g[2] + d[2][0] * e + d[2][1] * f + d[2][2] * c]);
            default:
                return null
        }
    }, reflectionIn:function (a) {
        if (a.anchor) {
            var b = this.elements.slice();
            a = a.pointClosestTo(b).elements;
            return Vector.create([a[0] + (a[0] - b[0]), a[1] + (a[1] - b[1]), a[2] + (a[2] - (b[2] || 0))])
        } else {
            var c = a.elements ||
                a;
            if (this.elements.length != c.length)return null;
            return this.map(function (d, e) {
                return c[e - 1] + (c[e - 1] - d)
            })
        }
    }, to3D:function () {
        var a = this.dup();
        switch (a.elements.length) {
            case 3:
                break;
            case 2:
                a.elements.push(0);
                break;
            default:
                return null
        }
        return a
    }, inspect:function () {
        return"[" + this.elements.join(", ") + "]"
    }, setElements:function (a) {
        this.elements = (a.elements || a).slice();
        return this
    }};
Vector.create = function (a) {
    return(new Vector).setElements(a)
};
Vector.i = Vector.create([1, 0, 0]);
Vector.j = Vector.create([0, 1, 0]);
Vector.k = Vector.create([0, 0, 1]);
Vector.Random = function (a) {
    var b = [];
    do b.push(Math.random()); while (--a);
    return Vector.create(b)
};
Vector.Zero = function (a) {
    var b = [];
    do b.push(0); while (--a);
    return Vector.create(b)
};
function Matrix() {
}
Matrix.prototype = {e:function (a, b) {
    if (a < 1 || a > this.elements.length || b < 1 || b > this.elements[0].length)return null;
    return this.elements[a - 1][b - 1]
}, row:function (a) {
    if (a > this.elements.length)return null;
    return Vector.create(this.elements[a - 1])
}, col:function (a) {
    if (a > this.elements[0].length)return null;
    var b = [], c = this.elements.length, d = c, e;
    do {
        e = d - c;
        b.push(this.elements[e][a - 1])
    } while (--c);
    return Vector.create(b)
}, dimensions:function () {
    return{rows:this.elements.length, cols:this.elements[0].length}
}, rows:function () {
    return this.elements.length
},
    cols:function () {
        return this.elements[0].length
    }, eql:function (a) {
        a = a.elements || a;
        if (typeof a[0][0] == "undefined")a = Matrix.create(a).elements;
        if (this.elements.length != a.length || this.elements[0].length != a[0].length)return false;
        var b = this.elements.length, c = b, d, e, f = this.elements[0].length, g;
        do {
            d = c - b;
            e = f;
            do {
                g = f - e;
                if (Math.abs(this.elements[d][g] - a[d][g]) > Sylvester.precision)return false
            } while (--e)
        } while (--b);
        return true
    }, dup:function () {
        return Matrix.create(this.elements)
    }, map:function (a) {
        var b = [], c = this.elements.length,
            d = c, e, f, g = this.elements[0].length, h;
        do {
            e = d - c;
            f = g;
            b[e] = [];
            do {
                h = g - f;
                b[e][h] = a(this.elements[e][h], e + 1, h + 1)
            } while (--f)
        } while (--c);
        return Matrix.create(b)
    }, isSameSizeAs:function (a) {
        a = a.elements || a;
        if (typeof a[0][0] == "undefined")a = Matrix.create(a).elements;
        return this.elements.length == a.length && this.elements[0].length == a[0].length
    }, add:function (a) {
        var b = a.elements || a;
        if (typeof b[0][0] == "undefined")b = Matrix.create(b).elements;
        if (!this.isSameSizeAs(b))return null;
        return this.map(function (c, d, e) {
            return c +
                b[d - 1][e - 1]
        })
    }, subtract:function (a) {
        var b = a.elements || a;
        if (typeof b[0][0] == "undefined")b = Matrix.create(b).elements;
        if (!this.isSameSizeAs(b))return null;
        return this.map(function (c, d, e) {
            return c - b[d - 1][e - 1]
        })
    }, canMultiplyFromLeft:function (a) {
        a = a.elements || a;
        if (typeof a[0][0] == "undefined")a = Matrix.create(a).elements;
        return this.elements[0].length == a.length
    }, multiply:function (a) {
        if (!a.elements)return this.map(function (p) {
            return p * a
        });
        var b = a.modulus ? true : false, c = a.elements || a;
        if (typeof c[0][0] == "undefined")c =
            Matrix.create(c).elements;
        if (!this.canMultiplyFromLeft(c))return null;
        var d = this.elements.length, e = d, f, g, h = c[0].length, i, k = this.elements[0].length, l = [], m, n, o;
        do {
            f = e - d;
            l[f] = [];
            g = h;
            do {
                i = h - g;
                m = 0;
                n = k;
                do {
                    o = k - n;
                    m += this.elements[f][o] * c[o][i]
                } while (--n);
                l[f][i] = m
            } while (--g)
        } while (--d);
        c = Matrix.create(l);
        return b ? c.col(1) : c
    }, x:function (a) {
        return this.multiply(a)
    }, minor:function (a, b, c, d) {
        var e = [], f = c, g, h, i, k = this.elements.length, l = this.elements[0].length;
        do {
            g = c - f;
            e[g] = [];
            h = d;
            do {
                i = d - h;
                e[g][i] = this.elements[(a +
                    g - 1) % k][(b + i - 1) % l]
            } while (--h)
        } while (--f);
        return Matrix.create(e)
    }, transpose:function () {
        var a = this.elements.length, b = this.elements[0].length, c = [], d = b, e, f, g;
        do {
            e = b - d;
            c[e] = [];
            f = a;
            do {
                g = a - f;
                c[e][g] = this.elements[g][e]
            } while (--f)
        } while (--d);
        return Matrix.create(c)
    }, isSquare:function () {
        return this.elements.length == this.elements[0].length
    }, max:function () {
        var a = 0, b = this.elements.length, c = b, d, e, f = this.elements[0].length, g;
        do {
            d = c - b;
            e = f;
            do {
                g = f - e;
                if (Math.abs(this.elements[d][g]) > Math.abs(a))a = this.elements[d][g]
            } while (--e)
        } while (--b);
        return a
    }, indexOf:function (a) {
        var b = this.elements.length, c = b, d, e, f = this.elements[0].length, g;
        do {
            d = c - b;
            e = f;
            do {
                g = f - e;
                if (this.elements[d][g] == a)return{i:d + 1, j:g + 1}
            } while (--e)
        } while (--b);
        return null
    }, diagonal:function () {
        if (!this.isSquare)return null;
        var a = [], b = this.elements.length, c = b, d;
        do {
            d = c - b;
            a.push(this.elements[d][d])
        } while (--b);
        return Vector.create(a)
    }, toRightTriangular:function () {
        var a = this.dup(), b, c = this.elements.length, d = c, e, f, g = this.elements[0].length, h;
        do {
            e = d - c;
            if (a.elements[e][e] == 0)for (j =
                                               e + 1; j < d; j++)if (a.elements[j][e] != 0) {
                b = [];
                f = g;
                do {
                    h = g - f;
                    b.push(a.elements[e][h] + a.elements[j][h])
                } while (--f);
                a.elements[e] = b;
                break
            }
            if (a.elements[e][e] != 0)for (j = e + 1; j < d; j++) {
                var i = a.elements[j][e] / a.elements[e][e];
                b = [];
                f = g;
                do {
                    h = g - f;
                    b.push(h <= e ? 0 : a.elements[j][h] - a.elements[e][h] * i)
                } while (--f);
                a.elements[j] = b
            }
        } while (--c);
        return a
    }, toUpperTriangular:function () {
        return this.toRightTriangular()
    }, determinant:function () {
        if (!this.isSquare())return null;
        var a = this.toRightTriangular(), b = a.elements[0][0], c = a.elements.length -
            1, d = c, e;
        do {
            e = d - c + 1;
            b *= a.elements[e][e]
        } while (--c);
        return b
    }, det:function () {
        return this.determinant()
    }, isSingular:function () {
        return this.isSquare() && this.determinant() === 0
    }, trace:function () {
        if (!this.isSquare())return null;
        var a = this.elements[0][0], b = this.elements.length - 1, c = b, d;
        do {
            d = c - b + 1;
            a += this.elements[d][d]
        } while (--b);
        return a
    }, tr:function () {
        return this.trace()
    }, rank:function () {
        var a = this.toRightTriangular(), b = 0, c = this.elements.length, d = c, e, f, g = this.elements[0].length, h;
        do {
            e = d - c;
            f = g;
            do {
                h = g - f;
                if (Math.abs(a.elements[e][h]) >
                    Sylvester.precision) {
                    b++;
                    break
                }
            } while (--f)
        } while (--c);
        return b
    }, rk:function () {
        return this.rank()
    }, augment:function (a) {
        a = a.elements || a;
        if (typeof a[0][0] == "undefined")a = Matrix.create(a).elements;
        var b = this.dup(), c = b.elements[0].length, d = b.elements.length, e = d, f, g, h = a[0].length, i;
        if (d != a.length)return null;
        do {
            f = e - d;
            g = h;
            do {
                i = h - g;
                b.elements[f][c + i] = a[f][i]
            } while (--g)
        } while (--d);
        return b
    }, inverse:function () {
        if (!this.isSquare() || this.isSingular())return null;
        var a = this.elements.length, b = a, c, d, e = this.augment(Matrix.I(a)).toRightTriangular(),
            f, g = e.elements[0].length, h, i, k = [], l;
        do {
            c = a - 1;
            i = [];
            f = g;
            k[c] = [];
            d = e.elements[c][c];
            do {
                h = g - f;
                l = e.elements[c][h] / d;
                i.push(l);
                h >= b && k[c].push(l)
            } while (--f);
            e.elements[c] = i;
            for (d = 0; d < c; d++) {
                i = [];
                f = g;
                do {
                    h = g - f;
                    i.push(e.elements[d][h] - e.elements[c][h] * e.elements[d][c])
                } while (--f);
                e.elements[d] = i
            }
        } while (--a);
        return Matrix.create(k)
    }, inv:function () {
        return this.inverse()
    }, round:function () {
        return this.map(function (a) {
            return Math.round(a)
        })
    }, snapTo:function (a) {
        return this.map(function (b) {
            return Math.abs(b - a) <=
                Sylvester.precision ? a : b
        })
    }, inspect:function () {
        var a = [], b = this.elements.length, c = b, d;
        do {
            d = c - b;
            a.push(Vector.create(this.elements[d]).inspect())
        } while (--b);
        return a.join("\n")
    }, setElements:function (a) {
        var b = a.elements || a;
        if (typeof b[0][0] != "undefined") {
            var c = b.length, d = c, e, f, g;
            this.elements = [];
            do {
                a = d - c;
                f = e = b[a].length;
                this.elements[a] = [];
                do {
                    g = f - e;
                    this.elements[a][g] = b[a][g]
                } while (--e)
            } while (--c);
            return this
        }
        d = c = b.length;
        this.elements = [];
        do {
            a = d - c;
            this.elements.push([b[a]])
        } while (--c);
        return this
    }};
Matrix.create = function (a) {
    return(new Matrix).setElements(a)
};
Matrix.I = function (a) {
    var b = [], c = a, d, e, f;
    do {
        d = c - a;
        b[d] = [];
        e = c;
        do {
            f = c - e;
            b[d][f] = d == f ? 1 : 0
        } while (--e)
    } while (--a);
    return Matrix.create(b)
};
Matrix.Diagonal = function (a) {
    var b = a.length, c = b, d, e = Matrix.I(b);
    do {
        d = c - b;
        e.elements[d][d] = a[d]
    } while (--b);
    return e
};
Matrix.Rotation = function (a, b) {
    if (!b)return Matrix.create([
        [Math.cos(a), -Math.sin(a)],
        [Math.sin(a), Math.cos(a)]
    ]);
    var c = b.dup();
    if (c.elements.length != 3)return null;
    var d = c.modulus(), e = c.elements[0] / d, f = c.elements[1] / d;
    c = c.elements[2] / d;
    d = Math.sin(a);
    var g = Math.cos(a), h = 1 - g;
    return Matrix.create([
        [h * e * e + g, h * e * f - d * c, h * e * c + d * f],
        [h * e * f + d * c, h * f * f + g, h * f * c - d * e],
        [h * e * c - d * f, h * f * c + d * e, h * c * c + g]
    ])
};
Matrix.RotationX = function (a) {
    var b = Math.cos(a);
    a = Math.sin(a);
    return Matrix.create([
        [1, 0, 0],
        [0, b, -a],
        [0, a, b]
    ])
};
Matrix.RotationY = function (a) {
    var b = Math.cos(a);
    a = Math.sin(a);
    return Matrix.create([
        [b, 0, a],
        [0, 1, 0],
        [-a, 0, b]
    ])
};
Matrix.RotationZ = function (a) {
    var b = Math.cos(a);
    a = Math.sin(a);
    return Matrix.create([
        [b, -a, 0],
        [a, b, 0],
        [0, 0, 1]
    ])
};
Matrix.Random = function (a, b) {
    return Matrix.Zero(a, b).map(function () {
        return Math.random()
    })
};
Matrix.Zero = function (a, b) {
    var c = [], d = a, e, f, g;
    do {
        e = a - d;
        c[e] = [];
        f = b;
        do {
            g = b - f;
            c[e][g] = 0
        } while (--f)
    } while (--d);
    return Matrix.create(c)
};
function Line() {
}
Line.prototype = {eql:function (a) {
    return this.isParallelTo(a) && this.contains(a.anchor)
}, dup:function () {
    return Line.create(this.anchor, this.direction)
}, translate:function (a) {
    a = a.elements || a;
    return Line.create([this.anchor.elements[0] + a[0], this.anchor.elements[1] + a[1], this.anchor.elements[2] + (a[2] || 0)], this.direction)
}, isParallelTo:function (a) {
    if (a.normal)return a.isParallelTo(this);
    a = this.direction.angleFrom(a.direction);
    return Math.abs(a) <= Sylvester.precision || Math.abs(a - Math.PI) <= Sylvester.precision
},
    distanceFrom:function (a) {
        if (a.normal)return a.distanceFrom(this);
        if (a.direction) {
            if (this.isParallelTo(a))return this.distanceFrom(a.anchor);
            var b = this.direction.cross(a.direction).toUnitVector().elements, c = this.anchor.elements;
            a = a.anchor.elements;
            return Math.abs((c[0] - a[0]) * b[0] + (c[1] - a[1]) * b[1] + (c[2] - a[2]) * b[2])
        } else {
            var d = a.elements || a;
            c = this.anchor.elements;
            b = this.direction.elements;
            a = d[0] - c[0];
            var e = d[1] - c[1];
            d = (d[2] || 0) - c[2];
            c = Math.sqrt(a * a + e * e + d * d);
            if (c === 0)return 0;
            b = (a * b[0] + e * b[1] + d * b[2]) /
                c;
            b = 1 - b * b;
            return Math.abs(c * Math.sqrt(b < 0 ? 0 : b))
        }
    }, contains:function (a) {
        a = this.distanceFrom(a);
        return a !== null && a <= Sylvester.precision
    }, liesIn:function (a) {
        return a.contains(this)
    }, intersects:function (a) {
        if (a.normal)return a.intersects(this);
        return!this.isParallelTo(a) && this.distanceFrom(a) <= Sylvester.precision
    }, intersectionWith:function (a) {
        if (a.normal)return a.intersectionWith(this);
        if (!this.intersects(a))return null;
        var b = this.anchor.elements, c = this.direction.elements, d = a.anchor.elements, e = a.direction.elements;
        a = c[0];
        var f = c[1];
        c = c[2];
        var g = e[0], h = e[1];
        e = e[2];
        var i = b[0] - d[0], k = b[1] - d[1];
        d = b[2] - d[2];
        var l = g * g + h * h + e * e, m = a * g + f * h + c * e;
        g = ((-a * i - f * k - c * d) * l / (a * a + f * f + c * c) + m * (g * i + h * k + e * d)) / (l - m * m);
        return Vector.create([b[0] + g * a, b[1] + g * f, b[2] + g * c])
    }, pointClosestTo:function (a) {
        if (a.direction) {
            if (this.intersects(a))return this.intersectionWith(a);
            if (this.isParallelTo(a))return null;
            var b = this.direction.elements, c = a.direction.elements, d = b[0], e = b[1];
            b = b[2];
            var f = c[0], g = c[1], h = c[2];
            c = b * f - d * h;
            var i = d * g - e * f, k = e * h - b * g;
            d =
                Vector.create([c * h - i * g, i * f - k * h, k * g - c * f]);
            a = Plane.create(a.anchor, d);
            return a.intersectionWith(this)
        } else {
            a = a.elements || a;
            if (this.contains(a))return Vector.create(a);
            c = this.anchor.elements;
            b = this.direction.elements;
            d = b[0];
            e = b[1];
            b = b[2];
            f = c[0];
            i = c[1];
            g = c[2];
            c = d * (a[1] - i) - e * (a[0] - f);
            i = e * ((a[2] || 0) - g) - b * (a[1] - i);
            k = b * (a[0] - f) - d * ((a[2] || 0) - g);
            d = Vector.create([e * c - b * k, b * i - d * c, d * k - e * i]);
            e = this.distanceFrom(a) / d.modulus();
            return Vector.create([a[0] + d.elements[0] * e, a[1] + d.elements[1] * e, (a[2] || 0) + d.elements[2] *
                e])
        }
    }, rotate:function (a, b) {
        if (typeof b.direction == "undefined")b = Line.create(b.to3D(), Vector.k);
        var c = Matrix.Rotation(a, b.direction).elements, d = b.pointClosestTo(this.anchor).elements, e = this.anchor.elements, f = this.direction.elements, g = d[0], h = d[1];
        d = d[2];
        var i = e[0] - g, k = e[1] - h;
        e = e[2] - d;
        return Line.create([g + c[0][0] * i + c[0][1] * k + c[0][2] * e, h + c[1][0] * i + c[1][1] * k + c[1][2] * e, d + c[2][0] * i + c[2][1] * k + c[2][2] * e], [c[0][0] * f[0] + c[0][1] * f[1] + c[0][2] * f[2], c[1][0] * f[0] + c[1][1] * f[1] + c[1][2] * f[2], c[2][0] * f[0] + c[2][1] * f[1] +
            c[2][2] * f[2]])
    }, reflectionIn:function (a) {
        if (a.normal) {
            var b = this.anchor.elements, c = this.direction.elements, d = b[0], e = b[1];
            b = b[2];
            var f = c[0], g = c[1], h = c[2];
            c = this.anchor.reflectionIn(a).elements;
            d = d + f;
            e = e + g;
            b = b + h;
            a = a.pointClosestTo([d, e, b]).elements;
            return Line.create(c, [a[0] + (a[0] - d) - c[0], a[1] + (a[1] - e) - c[1], a[2] + (a[2] - b) - c[2]])
        } else if (a.direction)return this.rotate(Math.PI, a); else {
            a = a.elements || a;
            return Line.create(this.anchor.reflectionIn([a[0], a[1], a[2] || 0]), this.direction)
        }
    }, setVectors:function (a, b) {
        a = Vector.create(a);
        b = Vector.create(b);
        a.elements.length == 2 && a.elements.push(0);
        b.elements.length == 2 && b.elements.push(0);
        if (a.elements.length > 3 || b.elements.length > 3)return null;
        var c = b.modulus();
        if (c === 0)return null;
        this.anchor = a;
        this.direction = Vector.create([b.elements[0] / c, b.elements[1] / c, b.elements[2] / c]);
        return this
    }};
Line.create = function (a, b) {
    return(new Line).setVectors(a, b)
};
Line.X = Line.create(Vector.Zero(3), Vector.i);
Line.Y = Line.create(Vector.Zero(3), Vector.j);
Line.Z = Line.create(Vector.Zero(3), Vector.k);
function Plane() {
}
Plane.prototype = {eql:function (a) {
    return this.contains(a.anchor) && this.isParallelTo(a)
}, dup:function () {
    return Plane.create(this.anchor, this.normal)
}, translate:function (a) {
    a = a.elements || a;
    return Plane.create([this.anchor.elements[0] + a[0], this.anchor.elements[1] + a[1], this.anchor.elements[2] + (a[2] || 0)], this.normal)
}, isParallelTo:function (a) {
    if (a.normal) {
        a = this.normal.angleFrom(a.normal);
        return Math.abs(a) <= Sylvester.precision || Math.abs(Math.PI - a) <= Sylvester.precision
    } else if (a.direction)return this.normal.isPerpendicularTo(a.direction);
    return null
}, isPerpendicularTo:function (a) {
    a = this.normal.angleFrom(a.normal);
    return Math.abs(Math.PI / 2 - a) <= Sylvester.precision
}, distanceFrom:function (a) {
    if (this.intersects(a) || this.contains(a))return 0;
    if (a.anchor) {
        var b = this.anchor.elements, c = a.anchor.elements;
        a = this.normal.elements;
        return Math.abs((b[0] - c[0]) * a[0] + (b[1] - c[1]) * a[1] + (b[2] - c[2]) * a[2])
    } else {
        c = a.elements || a;
        b = this.anchor.elements;
        a = this.normal.elements;
        return Math.abs((b[0] - c[0]) * a[0] + (b[1] - c[1]) * a[1] + (b[2] - (c[2] || 0)) * a[2])
    }
}, contains:function (a) {
    if (a.normal)return null;
    if (a.direction)return this.contains(a.anchor) && this.contains(a.anchor.add(a.direction)); else {
        a = a.elements || a;
        var b = this.anchor.elements, c = this.normal.elements;
        return Math.abs(c[0] * (b[0] - a[0]) + c[1] * (b[1] - a[1]) + c[2] * (b[2] - (a[2] || 0))) <= Sylvester.precision
    }
}, intersects:function (a) {
    if (typeof a.direction == "undefined" && typeof a.normal == "undefined")return null;
    return!this.isParallelTo(a)
}, intersectionWith:function (a) {
    if (!this.intersects(a))return null;
    if (a.direction) {
        var b = a.anchor.elements, c = a.direction.elements;
        a = this.anchor.elements;
        var d = this.normal.elements;
        a = (d[0] * (a[0] - b[0]) + d[1] * (a[1] - b[1]) + d[2] * (a[2] - b[2])) / (d[0] * c[0] + d[1] * c[1] + d[2] * c[2]);
        return Vector.create([b[0] + c[0] * a, b[1] + c[1] * a, b[2] + c[2] * a])
    } else if (a.normal) {
        c = this.normal.cross(a.normal).toUnitVector();
        d = this.normal.elements;
        b = this.anchor.elements;
        var e = a.normal.elements, f = a.anchor.elements, g = Matrix.Zero(2, 2);
        for (a = 0; g.isSingular();) {
            a++;
            g = Matrix.create([
                [d[a % 3], d[(a + 1) % 3]],
                [e[a % 3], e[(a + 1) % 3]]
            ])
        }
        g = g.inverse().elements;
        b = d[0] * b[0] + d[1] * b[1] +
            d[2] * b[2];
        d = e[0] * f[0] + e[1] * f[1] + e[2] * f[2];
        b = [g[0][0] * b + g[0][1] * d, g[1][0] * b + g[1][1] * d];
        d = [];
        for (e = 1; e <= 3; e++)d.push(a == e ? 0 : b[(e + (5 - a) % 3) % 3]);
        return Line.create(d, c)
    }
}, pointClosestTo:function (a) {
    a = a.elements || a;
    var b = this.anchor.elements, c = this.normal.elements;
    b = (b[0] - a[0]) * c[0] + (b[1] - a[1]) * c[1] + (b[2] - (a[2] || 0)) * c[2];
    return Vector.create([a[0] + c[0] * b, a[1] + c[1] * b, (a[2] || 0) + c[2] * b])
}, rotate:function (a, b) {
    var c = Matrix.Rotation(a, b.direction).elements, d = b.pointClosestTo(this.anchor).elements, e = this.anchor.elements,
        f = this.normal.elements, g = d[0], h = d[1];
    d = d[2];
    var i = e[0] - g, k = e[1] - h;
    e = e[2] - d;
    return Plane.create([g + c[0][0] * i + c[0][1] * k + c[0][2] * e, h + c[1][0] * i + c[1][1] * k + c[1][2] * e, d + c[2][0] * i + c[2][1] * k + c[2][2] * e], [c[0][0] * f[0] + c[0][1] * f[1] + c[0][2] * f[2], c[1][0] * f[0] + c[1][1] * f[1] + c[1][2] * f[2], c[2][0] * f[0] + c[2][1] * f[1] + c[2][2] * f[2]])
}, reflectionIn:function (a) {
    if (a.normal) {
        var b = this.anchor.elements, c = this.normal.elements, d = b[0], e = b[1];
        b = b[2];
        var f = c[0], g = c[1], h = c[2];
        c = this.anchor.reflectionIn(a).elements;
        d = d + f;
        e = e + g;
        b =
            b + h;
        a = a.pointClosestTo([d, e, b]).elements;
        return Plane.create(c, [a[0] + (a[0] - d) - c[0], a[1] + (a[1] - e) - c[1], a[2] + (a[2] - b) - c[2]])
    } else if (a.direction)return this.rotate(Math.PI, a); else {
        a = a.elements || a;
        return Plane.create(this.anchor.reflectionIn([a[0], a[1], a[2] || 0]), this.normal)
    }
}, setVectors:function (a, b, c) {
    a = Vector.create(a);
    a = a.to3D();
    if (a === null)return null;
    b = Vector.create(b);
    b = b.to3D();
    if (b === null)return null;
    if (typeof c == "undefined")c = null; else {
        c = Vector.create(c);
        c = c.to3D();
        if (c === null)return null
    }
    var d =
        a.elements[0], e = a.elements[1], f = a.elements[2], g = b.elements[0], h = b.elements[1], i = b.elements[2];
    if (c !== null) {
        b = c.elements[0];
        var k = c.elements[1];
        c = c.elements[2];
        e = Vector.create([(h - e) * (c - f) - (i - f) * (k - e), (i - f) * (b - d) - (g - d) * (c - f), (g - d) * (k - e) - (h - e) * (b - d)]);
        d = e.modulus();
        if (d === 0)return null;
        e = Vector.create([e.elements[0] / d, e.elements[1] / d, e.elements[2] / d])
    } else {
        d = Math.sqrt(g * g + h * h + i * i);
        if (d === 0)return null;
        e = Vector.create([b.elements[0] / d, b.elements[1] / d, b.elements[2] / d])
    }
    this.anchor = a;
    this.normal = e;
    return this
}};
Plane.create = function (a, b, c) {
    return(new Plane).setVectors(a, b, c)
};
Plane.XY = Plane.create(Vector.Zero(3), Vector.k);
Plane.YZ = Plane.create(Vector.Zero(3), Vector.i);
Plane.ZX = Plane.create(Vector.Zero(3), Vector.j);
Plane.YX = Plane.XY;
Plane.ZY = Plane.YZ;
Plane.XZ = Plane.ZX;
var $V = Vector.create, $M = Matrix.create, $L = Line.create, $P = Plane.create;