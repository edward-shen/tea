import ids from '../../src/parsers/questionIDs';

it('should not have a length of 0', () => {
  expect(ids.length).toBeGreaterThan(0);
});
