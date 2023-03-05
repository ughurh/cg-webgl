
const VS_SOURCE = `
  attribute vec3 pos;
  attribute vec4 clr;

  uniform mat4 trans;

  varying vec4 vcolor;

  void main()
  {
    gl_Position = trans * vec4(pos,1);
    vcolor = clr;
  }
`

const FS_SOURCE = `
  precision mediump float;

  varying vec4 vcolor;

  void main()
  {
    gl_FragColor = vcolor;
  }
`

window.onload = () => {
  let canvas = document.getElementById('glcanvas');
  let gl = canvas.getContext('webgl');

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = pixelRatio * canvas.clientWidth;
  canvas.height = pixelRatio * canvas.clientHeight;
  
  let positions = [
    0.0, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
  ];

  let colors = [
    1,0,0,1,
    0,1,0,1,
    0,0,1,1,
  ];

  let position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  let color_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, VS_SOURCE);
  gl.compileShader(vs);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    alert(gl.getSgaderInfoLog(vs));
    gl.deleteShader(vs);
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, FS_SOURCE);
  gl.compileShader(fs);

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert(gl.getSgaderInfoLog(fs));
    gl.deleteShader(fs);
  }

  let prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(prog));
  }

  let m = gl.getUniformLocation(prog, 'trans');

  let matrix = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  ]

  gl.useProgram(prog);
  gl.uniformMatrix4fv(m, false, matrix);

  let p = gl.getAttribLocation(prog, 'pos');
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p);
  
  let c = gl.getAttribLocation(prog, 'clr');
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(c);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.lineWidth(1.0);
  gl.useProgram(prog);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
