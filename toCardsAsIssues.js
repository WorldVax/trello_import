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
        'name': card.name,
        'text': card.desc,
        'labels': ['User Story', 'Phase 1', 'P2'],
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
    _.each(history, function (action) {
        var event = createHistory(action);
        if (event) issue.history.push(event);
    })
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
    list.name = checklist.name;
    _.each(checklist.checkItems, function (item) {
        list.items.push(item.name);
    });
    return list;
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