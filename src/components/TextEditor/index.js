import React from 'react';
import ReactDOM from 'react-dom';
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  Modifier,
  getDefaultKeyBinding
} from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import PropTypes from 'prop-types';
import style from './style.css';
import ReactDOMServer from 'react-dom/server';

const styleMap = {
  HIGHLIGHT0: {
    backgroundColor: 'lightsalmon'
  },
  HIGHLIGHT1: {
    backgroundColor: 'lightblue'
  },
  HIGHLIGHT2: {
    backgroundColor: 'lightgreen'
  }
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    let editorState = this.loadArticleIntoEditor(
      this.props.article,
      this.props.claims
    );

    this.state = {
      editorState: editorState,
      showHighlightOptions: false
    };
  }

  loadArticleIntoEditor = (article, claims) => {
    let editorState;
    if (article.trim() != '') {
      var rawJsText = this.textToJSON(article, claims);
      console.log(rawJsText);
      const content = convertFromRaw(JSON.parse(rawJsText));
      editorState = EditorState.createWithContent(content);
      editorState = EditorState.moveFocusToEnd(editorState);
    } else {
      editorState = EditorState.createEmpty();
    }

    return editorState;
  };

  //put highlight styling onto claims
  textToJSON = (text, claims) => {
    // need escape characters for quotes
    text = text.split('"').join('\\"');

    var rawJSONText = `{
      "entityMap": {},
      "blocks": [
      {`;
    /** append article **/
    rawJSONText = rawJSONText.concat(`"text": "`);
    rawJSONText = rawJSONText.concat(text);
    rawJSONText = rawJSONText.concat(`",
          "inlineStyleRanges": [`);
    /** **/
    //var ids = this.state.claimIds;
    var ids = {};
    for (let i = 0; i < claims.length; i++) {
      let claimKey = '';
      claimKey = claimKey.concat(
        claims[i].start_index,
        '-',
        claims[i].text.length
      );
      /** append claims **/
      rawJSONText = rawJSONText.concat(`{"offset":`);
      rawJSONText = rawJSONText.concat(claims[i].start_index);
      rawJSONText = rawJSONText.concat(`,"length":`);
      rawJSONText = rawJSONText.concat(claims[i].text.length);
      rawJSONText = rawJSONText.concat(`,"id":`);
      rawJSONText = rawJSONText.concat(claims[i].id);
      rawJSONText = rawJSONText.concat(`,"style":`);
      if (claims[i].type_id == 0) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT0"}`);
        claimKey = claimKey.concat('-HIGHLIGHT0');
      } else if (claims[i].type_id == 1) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT1"}`);
        claimKey = claimKey.concat('-HIGHLIGHT1');
      } else if (claims[i].type_id == 2) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT2"}`);
        claimKey = claimKey.concat('-HIGHLIGHT2');
      }
      if (i != claims.length - 1) {
        //not at the last claim
        rawJSONText = rawJSONText.concat(`,`);
      }
      ids[claimKey] = claims[i].id;
    }
    rawJSONText = rawJSONText.concat(`]}]}`);
    this.setState({ claimIds: ids });
    return rawJSONText;
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.article &&
      nextProps.claims &&
      (nextProps.claims.length != this.props.claims.length ||
        nextProps.article.length != nextProps.article.length)
    ) {
      this.setState({
        editorState: this.loadArticleIntoEditor(
          nextProps.article,
          nextProps.claims
        )
      });
    }
  }

  /*
  command argument supplied to handleKeyCommand is a string of name of command to be edited
  */
  // rich styling using keys
  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  handleKeyDown = () => {
    let contentMap = convertToRaw(this.state.editorState.getCurrentContent());
    let editStartIndex = this.state.editorState.getSelection().getStartOffset();
    let _blocks = contentMap['blocks'];
    let currBlock = _blocks[0];
    let articleText = currBlock['text'];
    this.props.updateArticle(articleText, editStartIndex);
  };

  keyBindingFn = e => {
    if (e.type == 'keydown') {
      this.handleKeyDown();
    }
    return getDefaultKeyBinding(e);
  };

  saveContent = content => {
    window.localStorage.setItem(
      'content',
      JSON.stringify(convertToRaw(content))
    );
  };

  /**
   * source : https://github.com/facebook/draft-js/issues/442
   * Get current selected text
   * @param  {Draft.ContentState}
   * @param  {Draft.SelectionState}
   * @param  {String}
   * @return {String}
   */
  _getTextSelection = (contentState, selection, blockDelimiter) => {
    blockDelimiter = blockDelimiter || '\n';
    var startKey = selection.getStartKey();
    var endKey = selection.getEndKey();
    var blocks = contentState.getBlockMap();

    var lastWasEnd = false;
    var selectedBlock = blocks
      .skipUntil(function(block) {
        return block.getKey() === startKey;
      })
      .takeUntil(function(block) {
        var result = lastWasEnd;

        if (block.getKey() === endKey) {
          lastWasEnd = true;
        }

        return result;
      });

    return selectedBlock
      .map(function(block) {
        var key = block.getKey();
        var text = block.getText();

        var start = 0;
        var end = text.length;

        if (key === startKey) {
          start = selection.getStartOffset();
        }
        if (key === endKey) {
          end = selection.getEndOffset();
        }

        text = text.slice(start, end);
        return text;
      })
      .join(blockDelimiter);
  };

  isSelection = editorState => {
    const selection = editorState.getSelection();
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    return start !== end;
  };

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState
    });

    this.setState({
      editorSelection: this._getTextSelection(
        editorState.getCurrentContent(),
        editorState.getSelection()
      ),
      claimSelectionId: null
    });

    if (!this.isSelection(editorState)) {
      let contentMap = convertToRaw(this.state.editorState.getCurrentContent());
      let clickLocation = this.state.editorState
        .getSelection()
        .getStartOffset();
      let inRange = false;
      let _blocks = contentMap['blocks'];
      let currBlock = _blocks[0];
      let styleRanges = currBlock['inlineStyleRanges'];
      let claimText = '';
      console.log(contentMap);
      for (var i = 0; i < styleRanges.length; i++) {
        let startBound = styleRanges[i].offset;
        let endBound = styleRanges[i].length + startBound;
        let claimId = styleRanges[i].id;

        if ((clickLocation >= startBound) & (clickLocation <= endBound)) {
          inRange = true;
          let fullArticle = currBlock['text'];
          claimText = fullArticle.substring(startBound, endBound);
          console.log(claimId);
          this.setState({
            claimSelectionId: claimId
          });

          break;
        }
      }
      this.setState({
        clickInRange: inRange,
        claimSelectionText: claimText,
        showHighlightOptions: false
      });
    } else {
      this.setState({
        showHighlightOptions: true
      });
    }
  };

  _addClaim = (selection, type) => {
    const start_index = selection.getStartOffset();
    const end_index = selection.getEndOffset();
    const text = this.state.editorSelection;
    const id = Math.random();
    let claim = {
      id: id.toString(),
      raw_text_id: Math.random(),
      text,
      start_index,
      end_index,
      type_id: type,
      source_id: null,
      source_name: null,
      source_description: null,
      date_created: new Date(),
      date_updated: new Date(),
      date_verified: null
    };

    this.props.addClaim(claim);
  };

  _onHighlight0 = () => {
    if (!this.isSelection(this.state.editorState)) {
      return;
    }
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 0);
  };

  _onHighlight1 = () => {
    if (!this.isSelection(this.state.editorState)) {
      return;
    }
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 1);
  };

  _onHighlight2 = () => {
    if (!this.isSelection(this.state.editorState)) {
      return;
    }
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 2);
  };

  //toggle between showing add source input and not showing
  requestAddSource = () => {
    if (this.state.addSourceRequested) {
      this.setState({
        addSourceRequested: false
      });
    } else {
      this.setState({
        addSourceRequested: true
      });
    }
  };

  render() {
    return (
      <div className="content-div">
        <header className="top-header">
          {this.state.showHighlightOptions ? (
            <div>
              <button
                type="button"
                className="highlight-btn btn btn-outline-primary"
                id="proper-noun"
                onClick={this._onHighlight0}
              >
                Proper Noun
              </button>
              <button
                type="button"
                className="highlight-btn btn btn-outline-primary"
                id="number"
                onClick={this._onHighlight1}
              >
                Number
              </button>
              <button
                type="button"
                className="highlight-btn btn btn-outline-primary"
                id="quote"
                onClick={this._onHighlight2}
              >
                Quote
              </button>
            </div>
          ) : null}
        </header>
        <div className="editor-margin column clearfix">
          <div className="editor-div">
            <Editor
              customStyleMap={styleMap}
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              keyBindingFn={this.keyBindingFn}
            />
          </div>
        </div>
        <div className="control-margin column clearfix">
          <div className="controlPanel">
            Text Selection Panel <br />
            {this.state.editorSelection}
            {this.state.clickInRange ? (
              <div>
                <div> This is the claim you selected: </div>
                <div> {this.state.claimSelectionText} </div>
                <div> claim id: {this.state.claimSelectionId} </div>
              </div>
            ) : null}
            {this.state.clickInRange ? (
              <div>
                {!this.state.addSourceRequested ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    id="sourceButton"
                    onClick={() => this.requestAddSource()}
                  >
                    Add Source
                  </button>
                ) : null}
                {this.state.addSourceRequested ? (
                  <div>
                    <form>
                      <div className="form-group">
                        <label htmlFor="source-link">Source URL</label>
                        <input
                          id="source-link"
                          className="form-control"
                          placeholder="https://google.com"
                        />
                        <small
                          id="source-link-help"
                          className="form-text text-muted"
                        >
                          The link to the source that verifies this claim.
                        </small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="source-title">Source Title</label>
                        <input
                          id="source-title"
                          className="form-control"
                          placeholder=""
                        />
                      </div>
                      <div class="form-group">
                        <label htmlFor="source-desc">Source Description</label>
                        <textarea
                          className="form-control"
                          id="source-desc"
                          rows="3"
                        />
                        <small
                          id="source-desc-help"
                          className="form-text text-muted"
                        >
                          1-2 sentences on what this source is and how it
                          verifies this claim.
                        </small>
                      </div>
                      <button
                        type="text"
                        className="btn btn-primary"
                        id="submitInfoButton"
                      >
                        {/** onclick add source**/}
                        Verify Claim
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

TextEditor.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired,
  addClaim: PropTypes.func.isRequired,
  updateArticle: PropTypes.func.isRequired
};

export default TextEditor;
