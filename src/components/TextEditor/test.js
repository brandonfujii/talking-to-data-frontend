/**
 *
 * example code from Fulcrum
 * not used
 *
 **/
import React from 'react';
import { Editor, EditorState, ContentState, convertFromHTML } from 'draft-js';
import SimpleDecorator from 'draft-js-simpledecorator';
import Typo from 'typo-js';
window.dictionary = new Typo('en_US', false, false, {
  dictionaryPath: './assets/dictionaries'
});
var decorator = new SimpleDecorator(
  function strategy(contentBlock, callback, contentState) {
    // Decorate any span of text in the content block,
    // providing custom props!
    const text = contentBlock.getText();
    var customProps = { color: '#f00' };
    var curword = '';
    var curIdx = 0;
    for (var i = 0; i < text.length; i++) {
      var curChar = text[i];
      if (curChar == ' ') {
        var t = curword;
        if (!window.dictionary.check(t)) {
          callback(curIdx, i, { color: '#f00' });
        }
        curword = '';
        curIdx = i;
        continue;
      }
      curword += curChar;
    }
  },
  function component(props) {
    return <span style={{ color: props.color }}>{props.children}</span>;
    // return some React.Component
  }
);
export default class FulcrumEditor extends React.Component {
  constructor(props) {
    super(props);
    var blocksFromHTML = convertFromHTML(props.value);
    const editorState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.state = {
      editorState: EditorState.createWithContent(editorState, decorator)
    };
    this.onChange = editorState => {
      this.setState({ editorState });
    };
  }
  componentWillReceiveProps(nextProps) {
    var blocksFromHTML = convertFromHTML(nextProps.value);
    const editorState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.setState({
      editorState: EditorState.createWithContent(editorState, decorator)
    });
  }
  render() {
    return (
      <Editor
        style={this.props.style}
        onBlur={() => {
          if (this.props.onChange)
            this.props.onChange(
              this.state.editorState.getCurrentContent().getPlainText()
            );
        }}
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    );
  }
}
