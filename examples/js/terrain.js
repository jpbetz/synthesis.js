var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 10000);
var renderer = new THREE.WebGLRenderer();

var terrainRenderer = new TerrainRenderer(100, 7, 128);

var lodPlane;
var frustum;

function render() {
    controls.update();

    scene.remove(lodPlane);

    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);

    frustum = new THREE.Frustum();
    var frustumMatrix = new THREE.Matrix4();
    frustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromMatrix(frustumMatrix);

    lodPlane = terrainRenderer.generateLodPlane(camera.position, frustum);
    scene.add(lodPlane);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.add(new THREE.Vector3(50, 30, 50));
camera.lookAt(new THREE.Vector3(100, 80, 100));

// LIGHTS
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

pointLight = new THREE.PointLight( 0xffffff, 0.6, 10000 );
pointLight.position.set( 0, 3000, 0 );
pointLight.lookAt(0,0,0);
scene.add( pointLight );

dirLight.castShadow = true;

dirLight.shadowMapWidth = 2048;
dirLight.shadowMapHeight = 2048;

var d = 50;

dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;

dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
dirLight.shadowDarkness = 0.35;

// The X axis is red. The Y axis is green. The Z axis is blue.
//var axisHelper = new THREE.AxisHelper( 5 );
//scene.add( axisHelper );

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 5000.0;
controls.maxPolarAngle = Math.PI * 0.495;

render();
animate();