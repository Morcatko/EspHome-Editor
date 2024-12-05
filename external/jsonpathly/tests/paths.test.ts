import { paths, PathsOptions } from '../src/handler/paths';
import { query } from '../src/handler/query';
import { expect } from 'chai';

describe('paths', () => {
  const PAYLOAD = {
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    nested: {
      nested: [
        {
          nested: 2,
          exist: true,
        },
        {
          nested: 3,
          test: { nested: [] },
        },
      ],
    },
    other: {
      nested: 5,
      object: {
        test: '1',
        nested: 10,
      },
    },
  };

  const testCases = [
    { payload: PAYLOAD, path: `$.string` },
    { payload: PAYLOAD, path: `$.array.2` },
    { payload: PAYLOAD, path: `$.bad` },
    { payload: PAYLOAD, path: `$.array[?(@ > 3)]` },
    { payload: PAYLOAD, path: `$.array[?(@ > 3)]` },
    { payload: PAYLOAD, path: `$.*.book` },
    { payload: PAYLOAD, path: `$..*..book` },
    { payload: PAYLOAD, path: `$..*..book[*]` },
    { payload: PAYLOAD, path: `$..nested` },
    { payload: PAYLOAD, path: `$..*.nested..nested` },
    { payload: PAYLOAD, path: `$..*..*[0].nested` },
    { payload: PAYLOAD, path: `$..*..*[10].nested` },
    { payload: PAYLOAD, path: `$..*..*[10].nested` },
    { payload: PAYLOAD, path: `$..nested.nested[*]["nested"]` },
    { payload: PAYLOAD, path: `$..*.object` },
    { payload: PAYLOAD, path: `$..*.object..test` },
    { payload: PAYLOAD, path: `$..*.object.test` },
    { payload: PAYLOAD, path: `$.*.object.test` },
    { payload: PAYLOAD, path: `$..nested[?(@.number==1)]` },
    { payload: PAYLOAD, path: `$..[?(@.number < 2 )]` },
    { payload: PAYLOAD, path: `$..nested[?(@.number>=2)]` },
    { payload: PAYLOAD, path: `$..nested[?(@.number>=2)].number` },
    { payload: PAYLOAD, path: `$..nested[?(@.bad+2>=2)].number` },
    { payload: PAYLOAD, path: `$..nested[?(@.exist)]` },
    { payload: PAYLOAD, path: `$..nested[0,2]` },
    { payload: PAYLOAD, path: `$.array[-1]` },
    { payload: PAYLOAD, path: `$.array[10,11,12]` },
    { payload: PAYLOAD, path: `$.array[10]` },
    { payload: PAYLOAD, path: `$.string[1:3]` },
    { payload: PAYLOAD, path: `$.array[1:3]` },
    { payload: PAYLOAD, path: `$.array[-1:]` },
    { payload: PAYLOAD, path: `$.array[:3]` },
    { payload: PAYLOAD, path: `$.array[5:2]` },
    { payload: PAYLOAD, path: `$.array[:7:2]` },
    { payload: PAYLOAD, path: `$.array[::3]` },
    { payload: PAYLOAD, path: `$.array[2::3]` },
    { payload: PAYLOAD, path: `$.array[:2:]` },
    { payload: PAYLOAD, path: `$.array[:2]` },
    { payload: PAYLOAD, path: `$.array[7::]` },
    { payload: PAYLOAD, path: `$.array[5::2]` },
    { payload: PAYLOAD, path: `$.array[:]` },
    { payload: PAYLOAD, path: `$.array[0:2:2]` },
    { payload: PAYLOAD, path: `$..nested["value", "exist"]` },
    { payload: PAYLOAD, path: `$..*..nested.*` },
  ];

  testCases.forEach(({ payload, path }) => {
    it(path, () => {
      const res1 = query(payload, path, { returnArray: true });
      const res2 = paths(payload, path);
      const res3 = query(payload, res2 as string[]);

      expect(res1).to.deep.equal(res3);
    });
  });

  describe('exceptions', () => {
    const PAYLOAD = {
      string: 'string',
      array: [1, 2, 3, 4],
      nested: {
        object: 1,
      },
    };
    const testCases = [
      { payload: PAYLOAD, path: `$.string`, expected: [`$["string"]`], opts: {} },
      { payload: PAYLOAD, path: `$.array.2`, expected: [`$["array"][2]`], opts: {} },
      { payload: PAYLOAD, path: `$.bad`, expected: [], opts: {} },
      { payload: PAYLOAD, path: `$.array[?(@ > 3)]`, expected: [`$["array"][3]`], opts: {} },
      { payload: PAYLOAD, path: `$.array["badQUote']`, expected: [], opts: { hideExceptions: true } },
    ];

    testCases.forEach(({ payload, path, expected, opts }) => {
      it(path, () => {
        const res = paths(payload, path, opts as PathsOptions);

        expect(res).to.deep.equal(expected);
      });
    });

    it('should throw exception', () => {
      expect(() => {
        paths({}, 'bad');
      }).to.throw(Error);
    });
  });
});
