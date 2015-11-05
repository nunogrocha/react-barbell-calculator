var plates = [
  {value:25, colorTop:'#F20C0C', colorBottom:'#B00909', width:'80', height:'100%'},
  {value:20, colorTop:'#0513E3', colorBottom:'#09139E', width:'73', height:'100%'},
  {value:15, colorTop:'#D9D907', colorBottom:'#B3B304', width:'65', height:'100%'},
  {value:10, colorTop:'#4BB325', colorBottom:'#2A6E12', width:'55', height:'100%'},
  {value:5, colorTop:'#CFCFCF', colorBottom:'#999999', width:'40', height:'85%'},
  {value:2.5, colorTop:'#F20C0C', colorBottom:'#B00909', width:'35', height:'82%'},
  {value:2, colorTop:'#0513E3', colorBottom:'#09139E', width:'35', height:'80%'},
  {value:1.5, colorTop:'#D9D907', colorBottom:'#B3B304', width:'35', height:'78%'},
  {value:1, colorTop:'#4BB325', colorBottom:'#2A6E12', width:'35', height:'77%'},
  {value:0.5, colorTop:'#CFCFCF', colorBottom:'#999999', width:'35', height:'76%'}
];

var plateSpace = 3; //Interval margin between plates
var barWeight = 20; //Weight of the bar

function errorHandler(code) {
  var errorMsg;
  switch(code) {
    case 0:
      errorMsg = "";
      break;
    case 1:
      errorMsg = "Too many plates"
      break;
    case 2:
      errorMsg = "Weight must be higher than the bar"
      break;
    default:
      errorMsg = "Error";
      break;
  }

  var error = document.getElementById('error');
  error.innerHTML = '';
  var errorText = document.createTextNode(errorMsg);
  error.appendChild(errorText);
}

var BarbellApp = React.createClass({
  render: function() {
    return (
      <div className="barbellApp">
        <BarbellBody />
      </div>
    );
  }
});

var BarbellBody = React.createClass({
  getInitialState: function() {
    return {value: '100'};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
    if (event.target.value <= barWeight) {
      errorHandler(2);
    } else {
      errorHandler(0);
    }
  },
  render: function() {
    var value = this.state.value;
    return (
      <div className="barbellBody">
        <div className="barbellHeader">
          <h1>React Barbell Calculator</h1>
          <span className="subTitle">Show me </span>
          <input className="weightInput" type="number" value={value} onChange={this.handleChange} />
          <span className="subTitle"> kg</span>
          <span id="error"></span>
        </div>
        <BarbellBar weightChange={this.state} plates={plates} rack={[]}/>
      </div>
    );
  }
});

var BarbellBar = React.createClass({
  render: function() {
    var weight = this.props.weightChange.value - barWeight;
    var index = 0;

    while (weight > 0) {
      var mutexFoundValue = false;
      for (var i = 0; i < this.props.plates.length; i++) {
        var ammount = this.props.plates[i].value*2;
        if (ammount <= weight) {
          weight -= ammount;
          this.props.rack[index] = this.props.plates[i];
          index++;
          mutexFoundValue = true;
          break;
        }
      };
      if (!mutexFoundValue) {
        break;
      }
    }

    var rackOutput = [];
    var leftSpacer = 0;
    for (var i = 0; i < this.props.rack.length; i++) {
      leftSpacer += ( i>0 ? parseInt(this.props.rack[i-1].width) : 0 );

      if (leftSpacer > 530) {
        errorHandler(1);
        break;
      }

      rackOutput.push(<BarbellPlate id={i} weight={this.props.rack[i]} leftPlate={leftSpacer} />);
    }

    return (
       <div className="barbellBar">
        <div id="barbellPlateWeight">
        </div>
        <div className="barbellSVG">
          <div className="barbellPlates">
            {rackOutput}
          </div>
        </div>
      </div>
    );
  }
});

var BarbellPlate = React.createClass({
  render: function() {
    var plateStyle = {
      height: this.props.weight.height,
      width: this.props.weight.width + 'px',
      left: (parseInt(this.props.leftPlate) + (plateSpace) * this.props.id) + 'px',
      background: '-webkit-linear-gradient('+ this.props.weight.colorTop +', '+ this.props.weight.colorBottom +')',
      background: '-o-linear-gradient('+ this.props.weight.colorTop +', '+ this.props.weight.colorBottom +')', 
      background: '-moz-linear-gradient('+ this.props.weight.colorTop +', '+ this.props.weight.colorBottom +')',
      background: 'linear-gradient('+ this.props.weight.colorTop +', '+ this.props.weight.colorBottom +')'
    };

    return (
      <div id="slide" style={plateStyle} className="barbellPlate">
        &nbsp;
      </div>
    );
  }
});

ReactDOM.render(
  <BarbellApp />,
  document.getElementById('content')
);