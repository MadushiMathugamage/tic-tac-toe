"use strict";

// Dependencies

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sift = require("sift"),
    isThere = require("is-there"),
    abs = require("abs"),
    rJson = require("r-json"),
    wJson = require("w-json");

// Constants
var DEFAULT_PATH = abs("~/.ideas.json");

/**
 * Idea
 *
 * @name Idea
 * @function
 * @param {String} path The path to the JSON file where your ideas will be stored (default: `~/.ideas.json`).
 * @param {Function} callback The callback function.
 * @return {Idea} The `Idea` instance.
 */

var Idea = function () {
    function Idea(path, callback) {
        var _this = this;

        _classCallCheck(this, Idea);

        if (typeof path === "function") {
            callback = path;
            path = null;
        }

        // Defaults
        this.path = path = path || DEFAULT_PATH;
        callback = callback || function (err) {
            if (err) throw err;
        };

        // Init
        if (!isThere(this.path)) {
            this.ideas = [];
            this.save(callback);
        } else {
            this.list(function (err, ideas) {
                if (err) {
                    return callback(err);
                }
                _this.ideas = ideas;
                callback(null, ideas, _this);
            });
        }
    }
    /**
     * list
     * Lists all ideas.
     *
     * @name list
     * @function
     * @param {Function} callback The callback function.
     * @return {Idea} The `Idea` instance.
     */


    _createClass(Idea, [{
        key: "list",
        value: function list(callback) {
            rJson(this.path, function (err, content) {
                if (err) {
                    return callback(err);
                }
                callback(err, content);
            });
            return this;
        }
        /**
         * filter
         * Filters ideas.
         *
         * @name filter
         * @function
         * @param {Object} filters An MongoDB like query object.
         * @param {Function} callback The callback function.
         * @return {Idea} The `Idea` instance.
         */

    }, {
        key: "filter",
        value: function filter(filters, callback) {
            callback(null, sift(filters, this.ideas));
            return this;
        }
        /**
         * create
         *
         * @name create
         * @function
         * @param {String} idea The idea you have.
         * @param {Function} callback The callback function.
         * @return {Idea} The `Idea` instance.
         */

    }, {
        key: "create",
        value: function create(idea, callback) {
            if (!idea) {
                return callback(new Error("Idea cannot be empty."));
            }
            this.ideas.push({
                id: this.ideas.length,
                idea: idea,
                date: new Date(),
                state: "OPEN"
            });
            return this;
        }
        /**
         * solve
         * Solves an idea.
         *
         * @name solve
         * @function
         * @param {String} id The idea id.
         * @param {Function} callback The callback function.
         * @return {Idea} The `Idea` instance.
         */

    }, {
        key: "solve",
        value: function solve(id, callback) {
            if (!this.ideas[id - 1]) {
                return callback(new Error("Cannot find any idea with this id."));
            }
            this.ideas[id - 1].state = "SOLVED";
            return this;
        }
        /**
         * remove
         *
         * @name remove
         * @function
         * @param {String} id The idea id.
         * @param {Function} callback The callback function.
         * @return {Idea} The `Idea` instance.
         */

    }, {
        key: "remove",
        value: function remove(id, callback) {
            if (!this.ideas[id - 1]) {
                return callback(new Error("Cannot find any idea with this id."));
            }
            this.ideas.splice(id - 1, 1);
            this.ideas.map(function (idea, index) {
                idea.id = index + 1;
            });
            return this;
        }
        /**
         * save
         * Saves the ideas in the file.
         *
         * @name save
         * @function
         * @param {Function} callback The callback function.
         * @return {Idea} The `Idea` instance.
         */

    }, {
        key: "save",
        value: function save(callback) {
            wJson(this.path, this.ideas, callback);
            return this;
        }
    }]);

    return Idea;
}();

module.exports = Idea;