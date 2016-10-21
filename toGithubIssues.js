var cards = require('./cardsAsIssues.json');
var _ = require('underscore');

function main() {
    var issues = [];
    _.each(cards, function (card) {
        var issue = {
            'title': card.name,
            'body': card.text + '\n\n',
            'labels': card.labels
        };
        _.each(_.sortBy(card.lists, "date"), function (list) {
            issue.body = issue.body + createCheckList(list);
        });
        issue.body = issue.body + createHistory(card.history);
        issues.push(issue);
    });
    console.log(JSON.stringify(issues));
    return issues;
}

function createCheckList(list) {
    var str = '### ' + list.name + '\n';
    _.each(list.items, function (item) {
        str = str + '- [ ] ' + item + '\n';
    });
    return str;
}

function createHistory(list){
    var str = '### History\n';
    _.each(list, function (item) {
        str = str + item.date + ' @' + item.username + ' (' + item.member +')\n';
        str = str + '> ' + item.text + '\n';
    });
    return str;
}



main();