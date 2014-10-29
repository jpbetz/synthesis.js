function compileShader(shader) {
  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      return null;
  }
}

function loadProgram(shaderFilesContents) {

  var programId = gl.createProgram();
  var vertexShaderId = gl.createShader(GL_VERTEX_SHADER);
  var fragmentShaderId = gl.createShader(GL_FRAGMENT_SHADER);
  gl.attachShader(programId, vertexShaderId);
  gl.attachShader(programId, fragmentShaderId);

  // TODO: decide how to concat files and apply pre-processor directives to organize shaders
}

function loadShader(gl, url, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    success: function(content, status, xhr) {
        var text = xhr.responseText;
        var type = xhr.contentType;
        callback(text);
    }
  });
}
