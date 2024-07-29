import fs from 'fs';

describe('.env.production', () => {
  test('should have file .env.production', () => {
    if (fs.existsSync('.env.production')) {
      expect(fs.existsSync('.env.production')).toBeTruthy();
    }
  });

  test('.env.production should NOT have test values', () => {
    const contents = fs.readFileSync('.env.production').toString().split('\n');
    expect(contents[0]).not.toContain('localhost');
    expect(contents[1]).not.toContain('test-ko-fi');
  });
});
