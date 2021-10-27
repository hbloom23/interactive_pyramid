"use strict";

var canvas;
var gl;
var theta = [0, 0, 0];
var thetaLoc;
var angle;
var key;
var points = [];
var colors = [];

const vertices = [ 
   vec4(-0.5, -0.5, 0.5, 1.0),
   vec4(0.0, 0.5, 0.0, 1.0),
   vec4(0.5, -0.5, 0.5, 1.0),
   vec4(0.5, -0.5, -0.5, 1.0),
   vec4(-0.5, -0.5, -0.5, 1.0) 
];

const vertexColors = [
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green
    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ], // magenta

];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    colorCube();

    lines();

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("x-axis").value = 0;
    document.getElementById("y-axis").value = 0;
    document.getElementById("z-axis").value = 0;

    update();   
}

window.onkeydown = function(event) {
    key = event.keyCode;
    keyboard(key);
}

function keyboard(key) {

    if (key === 87) {
        angle = parseInt(document.getElementById("x-axis").value);
        angle = angle + 15;
        theta[0] = angle;
        document.getElementById("x-axis").value = angle;
    }
    
    if (key === 65) {
        angle = parseInt(document.getElementById("y-axis").value);
        angle = angle - 15;
        theta[1] = angle;
        document.getElementById("y-axis").value = angle;
    }
    
    if (key === 83) {
        angle = parseInt(document.getElementById("x-axis").value);
        angle = angle - 15;
        theta[0] = angle;
        document.getElementById("x-axis").value = angle;
    }
    
    if (key === 68) {
        angle = parseInt(document.getElementById("y-axis").value);
        angle = angle + 15
        theta[1] = angle;
        document.getElementById("y-axis").value = angle;
    }
    
    if (key === 81) {
        angle = parseInt(document.getElementById("z-axis").value);
        angle = angle - 15;
        theta[2] = angle;
        document.getElementById("z-axis").value = angle;
    }
    
    if (key === 69) {
        angle = parseInt(document.getElementById("z-axis").value);
        angle = angle + 15;
        theta[2] = angle;
        document.getElementById("z-axis").value = angle;
    } 
    
    if (key === 82) {
        reset();
    }
    
    if (key == 13) {
        apply();
    } 
}

function reset() {

    document.getElementById("x-axis").value = 0;
    document.getElementById("y-axis").value = 0;
    document.getElementById("z-axis").value = 0;
    theta = [0, 0, 0];
}

function apply() {

    theta[0] = parseInt(document.getElementById("x-axis").value);
    theta[1] = parseInt(document.getElementById("y-axis").value);
    theta[2] = parseInt(document.getElementById("z-axis").value);
}

function lines() {

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    colors.push(vec4(1.0, 0.0, 0.0, 1.0));
    points.push(vec4(1.0, 0.0, 0.0, 1.0));
    colors.push(vec4(1.0, 0.0, 0.0, 1.0));

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    colors.push(vec4(0.0, 1.0, 0.0, 1.0));
    points.push(vec4(0.0, 1.0, 0.0, 1.0));
    colors.push(vec4(0.0, 1.0, 0.0, 1.0));

    points.push(vec4(0.0, 0.0, 0.0, 1.0));
    colors.push(vec4(0.0, 0.0, 1.0, 1.0));
    points.push(vec4(0.0, 0.0, 1.0, 1.0));
    colors.push(vec4(0.0, 0.0, 1.0, 1.0));
}

function colorCube() {
    
    quad(0, 2, 3, 4);
    triangle(0, 2, 1);
    triangle(2, 3, 1);
    triangle(3, 4, 1);
    triangle(4, 0, 1);
    
}

function triangle(a, b, c) {

    var indices = [a, b, c];

    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

function quad(a, b, c, d) {

    var indices = [ a, b, c, a, c, d ];
    for (var i = 0; i < indices.length; ++i) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[1]);
    }
}

function update() {
    gl.uniform3fv(thetaLoc, theta);
    render();
    window.requestAnimationFrame(update);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length - 6);
    gl.drawArrays(gl.LINES, points.length - 6 , 6);  
}

