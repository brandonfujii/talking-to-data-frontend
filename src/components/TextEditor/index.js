import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding
} from 'draft-js';
import PropTypes from 'prop-types';
import style from './style.css';

const highlights = ['pronoun', 'number', 'quote', 'date'];

const styleMap = {
  HIGHLIGHT0: {
    backgroundColor: 'lightsalmon'
  },
  HIGHLIGHT1: {
    backgroundColor: 'lightblue'
  },
  HIGHLIGHT2: {
    backgroundColor: 'lightgreen'
  },
  HIGHLIGHT3: {
    backgroundColor: 'violet'
  }
};

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      showHighlightOptions: false,
      claimIds: {},
      addSourceRequested: false,
      source_form: {
        source_type: null,
        source_title: null,
        source_description: null,
        source_link: null,
        source_number: null,
        source_person: null
      },
      sourceFormType: 'link'
    };

    let editorState = this.loadArticleIntoEditor(
      this.props.article,
      this.props.claims
    );

    this.state = {
      ...this.state,
      editorState
    };
  }

  loadArticleIntoEditor = (article, claims) => {
    let editorState;
    if (article.trim() != '') {
      var rawJsText = this.textToJSON(article, claims, this);
      const content = convertFromRaw(JSON.parse(rawJsText));
      editorState = EditorState.createWithContent(content);
      editorState = EditorState.moveFocusToEnd(editorState);
    } else {
      editorState = EditorState.createEmpty();
    }

    return editorState;
  };

  //put highlight styling onto claims
  textToJSON = (text, claims, self) => {
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
    //console.log(self.state);
    var ids = self.state.claimIds;
    //var ids = {};
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
      } else if (claims[i].type_id == 3) {
        rawJSONText = rawJSONText.concat(`"HIGHLIGHT3"}`);
        claimKey = claimKey.concat('-HIGHLIGHT3');
      }
      if (i != claims.length - 1) {
        //not at the last claim
        rawJSONText = rawJSONText.concat(`,`);
      }
      ids[claimKey] = claims[i].id;
    }
    rawJSONText = rawJSONText.concat(`]}]}`);
    //console.log(ids);
    //this.setState({ claimIds: ids }, () => console.log(this.state.claimIds));
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
    //to do: set state of claimIds ??
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
    /**
    //test stuff
    console.log("Start Index: ",this.state.editorState
      .getSelection()
      .getStartOffset());
    console.log("End Index: ",this.state.editorState
      .getSelection()
      .getEndOffset());
    **/
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

      for (var i = 0; i < styleRanges.length; i++) {
        let startBound = styleRanges[i].offset;
        let endBound = styleRanges[i].length + startBound;

        if ((clickLocation >= startBound) & (clickLocation <= endBound)) {
          inRange = true;

          let fullArticle = currBlock['text'];
          claimText = fullArticle.substring(startBound, endBound);

          //look up the claim we are clicking on dictionary
          //{offset}-{length}-{style}
          let claimIdKey =
            startBound +
            '-' +
            styleRanges[i].length +
            '-' +
            styleRanges[i].style;

          let claimId = this.state.claimIds[claimIdKey];
          this.setState({
            claimSelectionId: claimId
          });
          break; //assumption: no claim overlap
        }
      }
      this.setState({
        clickInRange: inRange,
        claimSelectionText: claimText,
        showHighlightOptions: false
      });
    } else {
      this.setState({
        showHighlightOptions: true,
        addSourceRequested: false
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
      sources: [],
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

  _onHighlight3 = () => {
    if (!this.isSelection(this.state.editorState)) {
      return;
    }
    const selection = this.state.editorState.getSelection();
    this._addClaim(selection, 3);
  };

  //toggle between showing add source input and not showing
  requestAddSource = () => {
    this.setState({
      addSourceRequested: true
    });
  };

  findClaimById = claimId => {
    return this.props.claims.find(claim => {
      return claim.id == claimId;
    });
  };

  removeHighlightedClaim = claimId => {
    this.props.removeClaim(claimId);
    this.setState({
      claimSelectionId: null
    });
  };

  handleAddSource = type => {
    let source;
    let form = this.state.source_form;

    if (type == 'link') {
      source = {
        source_type: type,
        source_link: form.source_link,
        source_title: form.source_title,
        source_description: form.source_description
      };
    } else {
      source = {
        source_type: type,
        source_title: form.source_title,
        source_description: form.source_description,
        source_person: form.source_person,
        source_number: form.source_number
      };
    }

    this.props.addSource(this.state.claimSelectionId, source);
    this.nullifySourceForm();
  };

  nullifySourceForm = () => {
    this.setState({
      source_form: {
        source_type: null,
        source_title: null,
        source_description: null,
        source_link: null,
        source_number: null,
        source_person: null
      },
      addSourceRequested: false
    });
  };

  updateFormInput = (id, value) => {
    let form = this.state.source_form;
    form[id] = value;
    this.setState({
      source_form: form
    });
  };

  renderSources = claim => {
    if (claim) {
      return claim.sources.map((source, i) => {
        if (source.source_type == 'link') {
          return (
            <li className="source block-text" key={source.source_title}>
              <a href={`${source.source_link}`} target="_blank">
                <span className="block-title">
                  <i class="fa fa-link" /> Link
                </span>
                <div className="source-title">{source.source_title}</div>
                <div className="source-description">
                  {source.source_description}
                </div>
              </a>
            </li>
          );
        } else {
          return (
            <li className="source block-text" key={source.source_person}>
              <span className="block-title">
                <i class="fa fa-phone" /> Phone Contact
              </span>
              <div className="source-title">{source.source_person}</div>
              <div className="source-description">
                {source.source_number} - {source.source_description}
              </div>
            </li>
          );
        }
      });
    }
    return null;
  };

  render() {
    let selectedClaim = this.state.claimSelectionId
      ? this.findClaimById(this.state.claimSelectionId)
      : null;

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
              <button
                type="button"
                className="highlight-btn btn btn-outline-primary"
                id="date"
                onClick={this._onHighlight3}
              >
                Date
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
            {this.state.clickInRange ? (
              <div>
                {selectedClaim ? (
                  <div>
                    <div className="block-text" id="selected-claim">
                      <span
                        className={`block-title claim-type ${
                          highlights[selectedClaim.type_id]
                        }`}
                      >
                        {highlights[selectedClaim.type_id]}
                      </span>
                      <i
                        className="fa fa-times remove"
                        onClick={e =>
                          this.removeHighlightedClaim(
                            this.state.claimSelectionId
                          )
                        }
                      />
                      <div>{this.state.claimSelectionText}</div>
                    </div>
                    <div className="source-list">
                      <p className="source-list-title">
                        {selectedClaim && selectedClaim.sources.length > 0
                          ? selectedClaim.sources.length
                          : ''}{' '}
                        Verified Source(s)
                      </p>
                      {selectedClaim && selectedClaim.sources.length ? (
                        <ul>{this.renderSources(selectedClaim)}</ul>
                      ) : (
                        <div className="null-sources">No sources added</div>
                      )}
                    </div>
                  </div>
                ) : null}
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
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        if (this.state.sourceFormType == 'link') {
                          this.handleAddSource('link');
                        } else {
                          this.handleAddSource('phonecall');
                        }
                      }}
                    >
                      {this.state.sourceFormType == 'link' ? (
                        <div className="form-group">
                          <label htmlFor="source_link">Source URL</label>
                          <input
                            id="source_link"
                            className="form-control"
                            onChange={e =>
                              this.updateFormInput(e.target.id, e.target.value)
                            }
                            value={this.state.source_form.source_link || ''}
                            placeholder=""
                          />
                          <small
                            id="source-link-help"
                            className="form-text text-muted"
                          >
                            The link to the source that verifies this claim.
                          </small>
                        </div>
                      ) : (
                        <div className="form-group">
                          <label htmlFor="source_number">
                            Source Contact Number
                          </label>
                          <input
                            id="source_number"
                            className="form-control"
                            onChange={e =>
                              this.updateFormInput(e.target.id, e.target.value)
                            }
                            value={this.state.source_form.source_number || ''}
                            placeholder="(555) 555-5555"
                          />
                        </div>
                      )}
                      {this.state.sourceFormType == 'phonecall' ? (
                        <div className="form-group">
                          <label htmlFor="source_person">
                            Source Contact Name
                          </label>
                          <input
                            id="source_person"
                            className="form-control"
                            onChange={e =>
                              this.updateFormInput(e.target.id, e.target.value)
                            }
                            value={this.state.source_form.source_person || ''}
                            placeholder="E.g Barack Obama, U.S EPA"
                          />
                        </div>
                      ) : (
                        <div className="form-group">
                          <label htmlFor="source_title">Source Title</label>
                          <input
                            id="source_title"
                            onChange={e =>
                              this.updateFormInput(e.target.id, e.target.value)
                            }
                            className="form-control"
                            value={this.state.source_form.source_title || ''}
                            placeholder=""
                          />
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="source_description">
                          Source Description
                        </label>
                        <textarea
                          className="form-control"
                          id="source_description"
                          onChange={e =>
                            this.updateFormInput(e.target.id, e.target.value)
                          }
                          value={
                            this.state.source_form.source_description || ''
                          }
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
                      <p id="add-phone-call" className="form-text">
                        <a
                          href="#"
                          onClick={e =>
                            this.setState({
                              sourceFormType:
                                this.state.sourceFormType == 'link'
                                  ? 'phonecall'
                                  : 'link'
                            })
                          }
                        >
                          {this.state.sourceFormType == 'link' ? (
                            <span>+ Add a phone call source</span>
                          ) : (
                            <span>+ Add a link source</span>
                          )}
                        </a>
                      </p>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        id="submitInfoButton"
                      >
                        Verify Claim
                      </button>
                      <button
                        type="text"
                        className="btn btn-danger"
                        id="cancelSource"
                        onClick={e => {
                          e.preventDefault();
                          this.nullifySourceForm();
                        }}
                      >
                        Cancel
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
  updateArticle: PropTypes.func.isRequired,
  addSource: PropTypes.func.isRequired,
  removeClaim: PropTypes.func.isRequired
};

export default TextEditor;
