QUnit.test("LSystem Tests", function() {
  var lsystem = new LSystem('F', { 'F': 'FA', 'A': 'A[F]' });
  assert.equal( lsystem.derive(1), "FA");
  assert.equal( lsystem.derive(2), "FAA[F]");
  assert.equal( lsystem.derive(3), "FAA[F]A[F][FA]");

  var treeObject = lsystem.interpret(lsystem.derive(3), {});
  assert.equal(treeObject.children.length, 4); // 4 branches
});
