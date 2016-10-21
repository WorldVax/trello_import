var board = require('./trelloExport.json');
var _ = require('underscore');


function main() {
    var issues = [];
    _.each(board.cards, function (card) {
        var issue = createIssue(card);
        if (issue) issues.push(issue);
    });
    console.log(JSON.stringify(issues));
    return issues;
}

function createIssue(card) {
    var issue = {
        'id': card.id,
        'name': card.name.replace('#phase1', ''),
        'text': card.desc,
        'labels': ['user story', 'phase1'],
        'lists': [],
        'history': []
    };
    _.each(card.idChecklists, function (listId) {
        var list = createList(listId);
        if (list) issue.lists.push(list);
    });
    var history = _.filter(board.actions, function (action) {

        return (action.type == 'commentCard' || action.type == 'copyCommentCard') && action.data.card.id == card.id;
    });
    if (history.length > 0) {
        _.each(history, function (action) {
            var event = createHistory(action);
            if (event) issue.history.push(event);
        });
    };
    return issue;
}

function createList(listId) {
    var list = {
        'id': listId,
        'name': '',
        'items': []
    };
    var checklist = _.find(board.checklists, function (item) {
        return item.id === listId;
    });
    if (checklist.checkItems.length > 0) {
        list.name = checklist.name;
        _.each(checklist.checkItems, function (item) {
            list.items.push(item.name);
        });
        return list;
    } else {
        return null;
    }
}

function createHistory(action) {
    var history = {
        'text': action.data.text,
        'member': action.memberCreator.fullName,
        'username': action.memberCreator.username,
        'date': action.date
    }
    if (action.type == 'copyCommentCard') {
        history.member = action.member.fullName;
        history.username = action.member.username;
    }
    return history;
}

main();