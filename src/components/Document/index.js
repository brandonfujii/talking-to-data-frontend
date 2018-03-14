import React, { Component } from 'react';
import Filter from '../Filter';
import TextEditor from '../TextEditor';

const TYPES = {
  0: 'proper_noun',
  1: 'number',
  2: 'quotes'
};

class Document extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: `The White House is "actively considering issuing a veto threat" against the bipartisan immigration bill Thursday morning, a senior administration official said. And in a statement released late Wednesday night, the Department of Homeland Security had tough words for the plan, calling it "the end of immigration enforcement in America."The legislation from a group of 16 bipartisan senators would offer nearly 2 million young undocumented immigrants who came to the US as children before 2012 a path to citizenship over 10 to 12 years. The plan would also place $25 billion in a guarded trust for border security, would cut a small number of green cards each year for adult children of current green card holders, and would prevent parents from being sponsored for citizenship by their US citizen children if that child gained citizenship through the pathway created in the bill or if they brought the child to the US illegally. One provision the Department of Homeland Security particularly objected to would direct it to focus its arrests and deportations on criminals and newly arrived immigrants. The Trump administration has virtually removed all prioritization of arresting and deporting immigrants. It has targeted individuals with final deportation orders, some years and decades old, drawing criticism for deporting longtime members of communities with US citizen families. "The Schumer-Rounds-Collins proposal destroys the ability of the men and women from the Department of Homeland Security (DHS) to remove millions of illegal aliens," DHS said in a statement. "It would be the end of immigration enforcement in America and only serve to draw millions more illegal aliens with no way to remove them.`,
      claims: [
        {
          id: '12904129',
          raw_text_id: 1,
          text: 'The White House',
          start_index: 0,
          end_index: 15,
          type_id: 0,
          source_id: null,
          source_name: null,
          source_description: null,
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '12',
          raw_text_id: 1,
          text: '"actively considering issuing a veto threat"',
          start_index: 19,
          end_index: 63,
          type_id: 2,
          source_id: null,
          source_name: null,
          source_description: null,
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '12904131',
          raw_text_id: 1,
          text:
            '"The Schumer-Rounds-Collins proposal destroys the ability of the men and women from the Department of Homeland Security (DHS) to remove millions of illegal aliens,"',
          start_index: 1383,
          end_index: 1547,
          type_id: 2,
          source_id: null,
          source_name: null,
          source_description: null,
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        }
      ]
    };
  }

  render() {
    return (
      <div>
        {/*}
        <Filter article={this.state.article} claims={this.state.claims} />
        <TextField article={this.state.article} claims={this.state.claims} />
        */}
        <TextEditor article={this.state.article} claims={this.state.claims} />
      </div>
    );
  }
}

export default Document;
