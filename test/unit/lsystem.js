QUnit.test("LSystem Tests", function() {
  var lsystem = new LSystem('F', { 'F': 'FA' });
  assert.equal( lsystem.derive(1), "FA");
  assert.equal( lsystem.derive(2), "FAA");
  assert.equal( lsystem.derive(3), "FAAA");
});
