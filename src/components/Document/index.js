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
      article: `The White House is "actively considering issuing a veto threat" against the bipartisan immigration bill Thursday morning, a senior administration official said. And in a statement released late Wednesday night, the Department of Homeland Security had tough words for the plan, calling it "the end of immigration enforcement in America." The legislation from a group of 16 bipartisan senators would offer nearly 2 million young undocumented immigrants who came to the US as children before 2012 a path to citizenship over 10 to 12 years. The plan would also place $25 billion in a guarded trust for border security, would cut a small number of green cards each year for adult children of current green card holders, and would prevent parents from being sponsored for citizenship by their US citizen children if that child gained citizenship through the pathway created in the bill or if they brought the child to the US illegally. One provision the Department of Homeland Security particularly objected to would direct it to focus its arrests and deportations on criminals and newly arrived immigrants. The Trump administration has virtually removed all prioritization of arresting and deporting immigrants. It has targeted individuals with final deportation orders, some years and decades old, drawing criticism for deporting longtime members of communities with US citizen families. "The Schumer-Rounds-Collins proposal destroys the ability of the men and women from the Department of Homeland Security (DHS) to remove millions of illegal aliens," DHS said in a statement. "It would be the end of immigration enforcement in America and only serve to draw millions more illegal aliens with no way to remove them."`,
      claims: [
        {
          id: '12904129',
          raw_text_id: 1,
          text: 'The White House',
          start_index: 0,
          end_index: 15,
          type_id: 0,
          sources: [],
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
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '121',
          raw_text_id: 1,
          text: 'Thursday morning',
          start_index: 104,
          end_index: 120,
          type_id: 3,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '122',
          raw_text_id: 1,
          text: 'Wednesday night',
          start_index: 194,
          end_index: 209,
          type_id: 3,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '123',
          raw_text_id: 1,
          text: 'Department of Homeland Security',
          start_index: 215,
          end_index: 246,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '124',
          raw_text_id: 1,
          text: '"the end of immigration enforcement in America."',
          start_index: 288,
          end_index: 350,
          type_id: 2,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '125',
          raw_text_id: 1,
          text: '16',
          start_index: 369,
          end_index: 371,
          type_id: 1,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '126',
          raw_text_id: 1,
          text: '2 million',
          start_index: 411,
          end_index: 421,
          type_id: 1,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '1261',
          raw_text_id: 1,
          text: 'US',
          start_index: 467,
          end_index: 469,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '127',
          raw_text_id: 1,
          text: '2012',
          start_index: 489,
          end_index: 492,
          type_id: 3,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '128',
          raw_text_id: 1,
          text: '10 to 12 years',
          start_index: 521,
          end_index: 535,
          type_id: 3,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '129',
          raw_text_id: 1,
          text: '$25 billion',
          start_index: 563,
          end_index: 574,
          type_id: 1,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '130',
          raw_text_id: 1,
          text: 'US',
          start_index: 787,
          end_index: 789,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '131',
          raw_text_id: 1,
          text: 'US',
          start_index: 916,
          end_index: 918,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '132',
          raw_text_id: 1,
          text: 'Department of Homeland Security',
          start_index: 948,
          end_index: 980,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '133',
          raw_text_id: 1,
          text: 'Trump',
          start_index: 1106,
          end_index: 1111,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '134',
          raw_text_id: 1,
          text: 'US',
          start_index: 1363,
          end_index: 1365,
          type_id: 0,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '12904131',
          raw_text_id: 1,
          text:
            '"The Schumer-Rounds-Collins proposal destroys the ability of the men and women from the Department of Homeland Security (DHS) to remove millions of illegal aliens,"',
          start_index: 1384,
          end_index: 1548,
          type_id: 2,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        },
        {
          id: '12904132',
          raw_text_id: 1,
          text:
            '"It would be the end of immigration enforcement in America and only serve to draw millions more illegal aliens with no way to remove them."',
          start_index: 1574,
          end_index: 1713,
          type_id: 2,
          sources: [],
          date_created: new Date(),
          date_updated: new Date(),
          date_verified: null
        }
      ],
      filter: -1
    };
  }

  updateArticle(text, edit_start_index, offset = 1) {
    let claims = this.state.claims.map((claim, i) => {
      if (claim.end_index <= edit_start_index) {
        return claim;
      } else if (
        claim.start_index <= edit_start_index &&
        claim.end_index >= edit_start_index
      ) {
        return {
          ...claim,
          end_index: claim.end_index + offset
        };
      } else {
        return {
          ...claim,
          start_index: claim.start_index + offset,
          end_index: claim.end_index + offset
        };
      }
    });

    this.setState({
      article: text,
      claims
    });
  }

  addClaim(claimObject) {
    this.setState({
      claims: [...this.state.claims, claimObject]
    });
  }

  addSource(claimId) {}

  render() {
    return (
      <div>
        <TextEditor
          article={this.state.article}
          claims={this.state.claims}
          addClaim={this.addClaim.bind(this)}
          updateArticle={this.updateArticle.bind(this)}
        />
      </div>
    );
  }
}

export default Document;
