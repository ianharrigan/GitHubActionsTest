const core = require('@actions/core');
const github = require('@actions/github');

try {
    const haxeVersion = core.getInput('haxe-version');
    console.log("-------------------------> RUNNING ACTION: " + haxeVersion);
} catch (error) {
    core.setFailed(error.message);
}