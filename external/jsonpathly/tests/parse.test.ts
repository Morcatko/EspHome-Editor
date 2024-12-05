import { parse } from '../src/parser/parse';
import { stringify } from '../src/parser/stringify';
import { expect } from 'chai';

describe('parse', () => {
  const textCases = [
    [`$.store.book[?(@.size nin ['M','L'])]`, ''],
    [`$.store.book[?(@.size nin ["M","L"])]`, ''],
    [`$..book[?(@.author == {"test":1})].title`, ''],
    [`$["book"]`, ''],
    [`$["book with space"]`, ''],
    [`$['book with  "double" quotes']`, `$["book with  \"double\" quotes"]`],
    [`$["book with  'single' quotes"]`, '$["book with  \'single\' quotes"]'],
    [`$.book["test"].title`, ''],
    [`$.phoneNumbers[?(@.price < 30)]`, ''],
    [`$.phoneNumbers[?((@.price < 30 && @.type == "iPhone") || @.num == 1)]`, ''],
    [`$`, ''],
    [`$[*]`, ''],
    [`$[0]`, ''],
    [`$[?(@.author)]`, ''],
    [`$..["book"]`, ''],
    [`$..book[0][category, author]`, ''],
    [`$..phoneNumbers[?(!(@.price < 30 && !(@.type == "iPhone") && !(@.number)))]`, ''],
    [`$..phoneNumbers[?(!(@.price < 30) && !(@.type == "iPhone") && !(@.number))]`, ''],
    [`$..phoneNumbers[?(@.price < 30 && !(@.type == "iPhone" && @.number))]`, ''],
    [`$.book[test, toto]`, ''],
    [`$.book["test", "toto"]`, ''],
    [`$.store.book[?(@.price < 10)]`, ''],
    [`$.store.book[?(@.price < 8 + 2)]`, ''],
    [`$.store.book[?(@.price < 8 * 2)]`, ''],
    [`$.store.book[?(@.price < 8 / 2)]`, ''],
    [`$.store.book[?(@.price < (8 / 2) + 1)]`, ''],
    [`$.store.book[?(@.price < 8 + @.price)]`, ''],
    [`$.store.book[?(@.price < 8 - 2)]`, ''],
    [`$.store.book[?(@.price == 10.2)]`, ''],
    [`$.store.book[?(@.price == true)]`, ''],
    [`$.store.book[?(@.price == false)]`, ''],
    [`$.store.book[?(@.price == null)]`, ''],
    [`$.store.book[?(@.price <= $.expensive)]`, ''],
    [`$.store.book[?(@.price == $.expensive)]`, ''],
    [`$.store.book[?(@.price != $.expensive)]`, ''],
    [`$.store.book[?(@.price >= $.expensive)]`, ''],
    [`$.store.book[?(@.price > $.expensive)]`, ''],
    [`$.store.book[?(@.price =~ /hello/)]`, ''],
    [`$.store.book[?(@.price =~ /hello/i)]`, ''],
    [`$.store.book[?(@.price =~ /hello/gui)]`, ''],
    [`$.store.book[?(@.price in [1,2,3])]`, ''],
    [`$..book[?(@.isbn)]`, ''],
    [`$..book[?(!(@.isbn))]`, ''],
    [`$..book[-1:].title`, ''],
    [`$..book[0, 1].title`, ''],
    [`$..book[0:1].title`, ''],
    [`$..book[:2].title`, ''],
    [`$..book[5:2].title`, ''],
    [`$..book[:7:2].title`, ''],
    [`$..book[::2].title`, ''],
    [`$..book[1::2].title`, ''],
    [`$..book[:1:].title`, `$..book[:1].title`],
    [`$..book[1::].title`, `$..book[1:].title`],
    [`$..book[5::2].title`, ''],
    [`$..book[:].title`, ''],
    [`$..book[0:2:1].title`, ''],
    [`$..book[?(@.author == 'J.R.R. Tolkien')].title`, ''],
    [`$..*`, ''],
  ];

  textCases.forEach(([input, expected]) => {
    it(input, (done) => {
      expect(() => {
        const tree = parse(input);

        if (expected) {
          expect(stringify(tree || null)).to.deep.equal(expected);
        } else {
          expect(stringify(tree || null)).to.deep.equal(input.replace(/'/g, '"'));
        }
        done();
      }).not.to.throw(Error);
    });
  });

  it('should not throw exceptions', () => {
    const tree = parse('bad', { hideExceptions: true });

    expect(tree).to.be.null;
  });
  it('should throw exceptions', () => {
    expect(() => {
      parse('bad');
    }).to.throw(Error);
  });
});
