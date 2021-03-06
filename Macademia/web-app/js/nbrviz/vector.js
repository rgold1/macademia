/*
Copyright (c) 2010 Dennis Hotson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

adapted from source: dhotson.github.com/springy.html
*/

var VECTOR_DEBUG = false;

function Vector(x, y)
{
	this.x = x;
	this.y = y;
}

Vector.random = function()
{
	return new Vector(Math.random()*2 - 1,Math.random() * 2 - 1);
}

Vector.prototype.add = function(v2)
{
    if(VECTOR_DEBUG && v2 == NaN)
        alert("adding NaN");
	return new Vector(this.x + v2.x, this.y + v2.y);
};

Vector.prototype.subtract = function(v2)
{
    if(VECTOR_DEBUG && v2 == NaN)
        alert("minus NaN");
	return new Vector(this.x - v2.x, this.y - v2.y);
};

Vector.prototype.multiply = function(n)
{
    if(VECTOR_DEBUG && n == NaN)
        alert("times NaN");
	return new Vector(this.x * n, this.y * n);
};

Vector.prototype.divide = function(n)
{
	if(VECTOR_DEBUG &&  (n==0 || n==NaN)) {
		alert("about to divide by zer0/NaN");
	}
	return new Vector(this.x / n, this.y / n);
};

Vector.prototype.magnitude = function()
{
	var a = Math.sqrt(this.x*this.x + this.y*this.y);
    if(VECTOR_DEBUG && a == NaN)
        alert("magnitude is NaN");
    return a
};
Vector.prototype.magnitude2 = function()
{
	return this.x*this.x + this.y*this.y;
};

Vector.prototype.normalise = function()
{
	if(VECTOR_DEBUG && (this.magnitude==0 || this.magnitude()==NaN)) {
		alert("zero vector has no direction!");
	}
	return this.divide(this.magnitude());
};

Vector.prototype.toString = function() {
    return ("{'x': "+this.x+", 'y': "+this.y+"}'");
}