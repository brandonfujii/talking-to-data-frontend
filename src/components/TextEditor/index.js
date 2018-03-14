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
      editorState: editorState
    };
  }

  loadArticleIntoEditor = (article, claims) => {
    let editorState;
    if (article.trim() != '') {
      var rawJsText = this.textToJSON(article, claims);
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
    for (let i = 0; i < claims.length; i++) {
      /** append claims **/
      rawJSONText = rawJSONText.concat(`{"offset":`);
      rawJSONText = rawJSONText.concat(claims[i].start_index);
      rawJSONText = rawJSONText.concat(`,"length":`);
      rawJSONText = rawJSONText.concat(claims[i].text.length);
      rawJSONText = rawJSONText.concat(`,"style":`);
      if (claims[i].type_id == 0) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT0"}`);
      } else if (claims[i].type_id == 1) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT1"}`);
      } else if (claims[i].type_id == 2) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT2"}`);
      }
      if (i != claims.length - 1) {
        //not at the last claim
        rawJSONText = rawJSONText.concat(`,`);
      }
    }
    rawJSONText = rawJSONText.concat(`]}]}`);
    return rawJSONText;
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.claims &&
      nextProps.claims.length != this.props.claims.length
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
    this.props.updateArticle();
  };

  keyBindingFn = e => {
    if (e.type == 'keydown') {
      console.log(e);
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
    /**
      if (!this.isSelection(editorState)) {
        return;
      } **/
    this.setState({
      editorSelection: this._getTextSelection(
        editorState.getCurrentContent(),
        editorState.getSelection()
      )
    });
    let contentMap = convertToRaw(this.state.editorState.getCurrentContent());
    let clickLocation = editorState.getSelection().getStartOffset();
    let inRange = false;
    let _blocks = contentMap['blocks'];
    let currBlock = _blocks[0];
    let styleRanges = currBlock['inlineStyleRanges'];
    let claimText = '';
    for (var i = 0; i < styleRanges.length; i++) {
      let startBound = styleRanges[i].offset;
      let endBound = styleRanges[i].length + startBound;
      if ((clickLocation >= startBound) & (clickLocation <= endBound)) {
        inRange = true;
        // do something here to get the claim from offset and length
        let fullArticle = currBlock['text'];
        claimText = fullArticle.substring(startBound, endBound);
        break;
      }
    }
    this.setState({
      clickInRange: inRange
    });
    this.setState({
      claimSelectionText: claimText
    });
  };

  _onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
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
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 0);
  };

  _onHighlight1 = () => {
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 1);
  };

  _onHighlight2 = () => {
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 2);
  };

  render() {
    return (
      <div className="content-div">
        <button onClick={this._onHighlight0}> Highlight Proper Noun </button>
        <button onClick={this._onHighlight1}> Highlight Number </button>
        <button onClick={this._onHighlight2}> Highlight Quote </button>
        <div className="editor-div column">
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            keyBindingFn={this.keyBindingFn}
          />
        </div>
        <div className="controlPanel column">
          Text Selection Panel <br />
          {this.state.editorSelection}
          {this.state.clickInRange ? (
            <div>
              <div> This is the claim you selected: </div>
              <div> {this.state.claimSelectionText} </div>
            </div>
          ) : null}
          {this.state.clickInRange ? (
            <div>
              <button className="sourceButton"> Add Source </button>
            </div>
          ) : null}
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
