export function parseBlueprint(levelString, columns) {
    const splitString = new RegExp(`.{1,${columns}}`, 'g');
    return levelString
        .match(splitString)
        .map((rowString) => {
        return rowString.split("")
            .map((numberString) => {
            return parseInt(numberString, 10);
        });
    });
}
