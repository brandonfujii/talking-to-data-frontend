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
  Modifier
} from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import PropTypes from 'prop-types';
import style from './style.css';
import MediaComponent from '../MediaComponent';
import PopUp from '../PopUp';
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
    let editorState;
    let editorSelection;
    //puts the article inside the editor
    if (this.props.article.trim() != '') {
      var rawJsText = this.textToJSON(this.props.article, this.props.claims);
      const content = convertFromRaw(JSON.parse(rawJsText));
      editorState = EditorState.createWithContent(content);
      editorState = EditorState.moveFocusToEnd(editorState);
    } else {
      editorState = EditorState.createEmpty();
    }
    this.state = {
      editorState: editorState
    };
  }
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

    if (!this.isSelection(editorState)) {
      return;
    }
    this.setState({
      editorSelection: this._getTextSelection(
        editorState.getCurrentContent(),
        editorState.getSelection()
      )
    });
  };

  _onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };
  _onHighlight0 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT0')
    );
  };

  _onHighlight1 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT1')
    );
  };

  _onHighlight2 = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT2')
    );
  };
  /**
  clearInlineStyles = (editorState) => {
    const styles = [
      'BOLD',
      'ITALIC',
      'UNDERLINE',
      'STRIKETHROUGH',
      'CODE',
      'HIGHLIGHT0',
      'HIGHLIGHT1'
    ];

    const contentWithoutStyles = _.reduce(styles, (newContentState, style) => (
      Modifier.removeInlineStyle(
        newContentState,
        editorState.getSelection(),
        style
      )
    ), editorState.getCurrentContent());

    return EditorState.push(
      editorState,
      contentWithoutStyles,
      'change-inline-style'
    );
  };
**/

  //render text using jsx
  renderTextHTML = (text, claims) => {
    let htmlString = text;
    let numShift = 0;
    //let everything = [];
    let everythingString = '';

    if (claims.length == 0) {
      //everything.push(this.createTextSpan(text,"text"));
      everythingString += ReactDOMServer.renderToStaticMarkup(
        this.createTextSpan(text, 'text')
      );
    } else {
      // for the first claim we want to append the before text and the first claim
      let claim1 = claims[0];
      let beforeText = htmlString.slice(0, claim1.start_index + numShift);
      let claimText = htmlString.slice(
        claim1.start_index + numShift,
        claim1.end_index + numShift
      );
      //everything.push(this.createSpan(beforeText, claim1, claimText));
      everythingString += ReactDOMServer.renderToStaticMarkup(
        this.createSpan(beforeText, claim1, claimText)
      );

      //for the rest of the claims
      for (let i = 0; i < claims.length - 1; ++i) {
        let claim1 = claims[i];
        let claim2 = claims[i + 1];
        let beforeText = htmlString.slice(
          claim1.end_index,
          claim2.start_index + numShift
        );
        let claimText = htmlString.slice(
          claim2.start_index + numShift,
          claim2.end_index + numShift
        );
        //everything.push(this.createSpan(beforeText, claim2, claimText));
        everythingString += ReactDOMServer.renderToStaticMarkup(
          this.createSpan(beforeText, claim2, claimText)
        );
      }
      //the rest of the text
      let afterText = htmlString.slice(claims[claims.length - 1].end_index);
      //everything.push(this.createTextSpan(afterText, 'afterText'));
      everythingString += ReactDOMServer.renderToStaticMarkup(
        this.createTextSpan(afterText, 'afterText')
      );
    }
    //return everything;
    return everythingString;
  };
  //just return a span for text
  createTextSpan = (text, textId) => {
    return <span key={`span-${textId}`}>{text}</span>;
  };
  //return a span for text and a claim
  createSpan = (beforeText, claim, claimText) => {
    return (
      <span key={`span-${claim.id}`}>
        <span> {beforeText} </span>
        <span id={claim.id} className={`highlight type-${claim.type_id}`}>
          {claimText}
          <PopUp />
        </span>
      </span>
    );
  };

  render() {
    return (
      <div className="content-div">
        <button onClick={this._onHighlight0}> Highlight Proper Noun </button>
        <button onClick={this._onHighlight1}> Highlight Number </button>
        <button onClick={this._onHighlight2}> Highlight Quote </button>
        {/*
        <button onClick ={this.clearInlineStyles}> Remove Styling </button>
        */}
        <div className="editor-div">
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onMouseDown={this.onChange}
          />
        </div>
        <div className="controlPanel">
          {/** control panel div **/}
          Text Selection: <br />
          {this.state.editorSelection}
        </div>
      </div>
    );
  }
}

TextEditor.propTypes = {
  article: PropTypes.string.isRequired,
  claims: PropTypes.array.isRequired
};
// https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/color/color.html

export default TextEditor;
