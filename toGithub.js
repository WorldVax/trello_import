
var github = require('octonode');

var issues = require('./githubIssues.json');
var _ = require('underscore');

var username = 'bob@example.com';
var pw = '123456';

function main() {

    var client = github.client({
        username: username,
        password: pw
    });

    var repo = client.repo('worldvax/FC-Connect');

    _.each(issues, function (issue) {
        repo.issue(issue, function (err, data) {

        }); //issue
    });
};

main();
