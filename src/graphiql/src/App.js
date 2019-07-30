// @flow

import React, { Component } from "react";
import GraphiQL from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import { buildClientSchema, getIntrospectionQuery, parse, print } from "graphql";


import "graphiql/graphiql.css";
import "./App.css";

import type { GraphQLSchema } from "graphql";

function fetcher(params: Object): Object {
  return fetch(
    "/",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }
  )
    .then(function(response) {
      return response.text();
    })
    .then(function(responseBody) {
      try {
        return JSON.parse(responseBody);
      } catch (e) {
        return responseBody;
      }
    });
}

const DEFAULT_QUERY = `
# Welcome to REACH GraphQL API explorer
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#       Run Query:  Ctrl-Enter (or press the play button above)
#   Auto Complete:  Ctrl-Space (or just start typing)
#
# At the top right corner of your screen you can find "Docs", clicking on
# which will open Documentation Explorer which lets you access the definations and accepted arguments by the
# query functions.
#
# Following is an example query which returns pmc_id and participant_a 
# information of the documents in the database

{
  allDocuments{
    pmc_id
    extracted_information{
      participant_a{
        entity_text
        identifier
      }
    }
  }
}

# Following is an example of a REACH file as stored in our database
# {
#     "_id" : ObjectId("5d00162be3318daa924b9959"),
#     "submitter" : "Reach",
#     "model_relation" : "extension",
#     "extracted_information" : {
#         "interaction_type" : "decreases_activity",
#         "negative_information" : false,
#         "hypothesis_information" : false,
#         "context" : {
#             "Species" : [ 
#                 "taxonomy:10535"
#             ]
#         },
#         "participant_b" : [ 
#             {
#                 "in_model" : true,
#                 "identifier" : "uniprot:P29972",
#                 "entity_text" : "AQP1",
#                 "entity_type" : "protein"
#             }
#         ],
#         "participant_a" : [ 
#             {
#                 "in_model" : true,
#                 "identifier" : "interpro:IPR000818",
#                 "entity_text" : "TEA",
#                 "entity_type" : "family"
#             }
#         ]
#     },
#     "reading_complete" : "2016-01-08T14:49:54Z",
#     "reader_type" : "machine",
#     "reading_started" : "2016-01-08T14:48:55Z",
#     "trigger" : "Block",
#     "evidence" : [ 
#         "Block by TEA of AQP1"
#     ],
#     "pmc_id" : "100781",
#     "score" : 0
# }
`;

type State = {
  schema: ?GraphQLSchema,
  query: string,
  explorerIsOpen: boolean
};

class App extends Component<{}, State> {
  _graphiql: GraphiQL;
  state = { schema: null, query: DEFAULT_QUERY, explorerIsOpen: true };

  componentDidMount() {
    let params = (new URL(document.location)).searchParams;
    let qry = params.get("query");
    if (qry != null && qry.length > 5)
      this.setState({ query : qry})

    fetcher({
      query: getIntrospectionQuery()
    }).then(result => {
      const editor = this._graphiql.getQueryEditor();
      editor.setOption("extraKeys", {
        ...(editor.options.extraKeys || {}),
        "Shift-Alt-LeftClick": this._handleInspectOperation
      });

      this.setState({ schema: buildClientSchema(result.data) });
    });
  }

  _handleInspectOperation = (
    cm: any,
    mousePos: { line: Number, ch: Number }
  ) => {
    const parsedQuery = parse(this.state.query || "");

    if (!parsedQuery) {
      console.error("Couldn't parse query document");
      return null;
    }

    var token = cm.getTokenAt(mousePos);
    var start = { line: mousePos.line, ch: token.start };
    var end = { line: mousePos.line, ch: token.end };
    var relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end)
    };

    var position = relevantMousePos;

    var def = parsedQuery.definitions.find(definition => {
      if (!definition.loc) {
        console.log("Missing location information for definition");
        return false;
      }

      const { start, end } = definition.loc;
      return start <= position.start && end >= position.end;
    });

    if (!def) {
      console.error(
        "Unable to find definition corresponding to mouse position"
      );
      return null;
    }

    var operationKind =
      def.kind === "OperationDefinition"
        ? def.operation
        : def.kind === "FragmentDefinition"
        ? "fragment"
        : "unknown";

    var operationName =
      def.kind === "OperationDefinition" && !!def.name
        ? def.name.value
        : def.kind === "FragmentDefinition" && !!def.name
        ? def.name.value
        : "unknown";

    var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

    var el = document.querySelector(selector);
    el && el.scrollIntoView();
  };

  _handleEditQuery = (query: string): void => {
      this.setState({ query })
      try {
        const parsedQuery = print(parse(query || ""))
        if (window.history.pushState) { 
          const newURL = new URL(window.location.href)
          newURL.search = `?query=${parsedQuery}` 
          window.history.replaceState({ path: newURL.href }, '', newURL.href); 
        }
      } catch (error) {
        console.log(error.message)
      }
    };

  _handleToggleExplorer = () => {
    this.setState({ explorerIsOpen: !this.state.explorerIsOpen });
  };

  render() {
    const { query, schema } = this.state;
    return (
      <div className="graphiql-container">
        <GraphiQLExplorer
          schema={schema}
          query={query}
          onEdit={this._handleEditQuery}
          onRunOperation={operationName =>
            this._graphiql.handleRunQuery(operationName)
          }
          explorerIsOpen={this.state.explorerIsOpen}
          onToggleExplorer={this._handleToggleExplorer}
        />
        <GraphiQL
          ref={ref => (this._graphiql = ref)}
          fetcher={fetcher}
          schema={schema}
          query={query}
          onEditQuery={this._handleEditQuery}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={() => this._graphiql.handlePrettifyQuery()}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={() => this._graphiql.handleToggleHistory()}
              label="History"
              title="Show History"
            />
            <GraphiQL.Button
              onClick={this._handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    );
  }
}

export default App;
