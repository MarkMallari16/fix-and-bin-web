import { useState } from 'react';
import { Wrench, Zap, Hammer, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const tutorials = [
  {
    category: 'Plumbing',
    icon: Wrench,
    color: 'blue',
    items: [
      {
        title: 'How to Fix a Leaky Faucet',
        difficulty: 'Easy',
        time: '15-30 min',
        steps: [
          'Turn off the water supply under the sink',
          'Remove the faucet handle using a screwdriver',
          'Replace the worn-out washer or O-ring',
          'Reassemble the faucet and turn water back on',
          'Test for leaks'
        ],
        tools: ['Adjustable wrench', 'Screwdriver', 'Replacement washers'],
        warning: 'Always turn off water supply before starting any plumbing work.'
      },
      {
        title: 'Unclogging a Drain',
        difficulty: 'Easy',
        time: '10-20 min',
        steps: [
          'Remove any visible debris from the drain',
          'Pour boiling water down the drain',
          'Use a plunger to create suction and dislodge the clog',
          'If needed, use a drain snake to reach deeper clogs',
          'Flush with hot water'
        ],
        tools: ['Plunger', 'Drain snake', 'Bucket'],
        warning: 'Avoid using chemical drain cleaners as they can damage pipes.'
      },
      {
        title: 'Running Toilet Repair',
        difficulty: 'Medium',
        time: '20-30 min',
        steps: [
          'Remove the toilet tank lid',
          'Check if the flapper is sealing properly',
          'Adjust the float arm if water level is too high',
          'Replace the flapper if it\'s worn or damaged',
          'Test the flush to ensure it stops running'
        ],
        tools: ['Replacement flapper', 'Adjustable wrench'],
        warning: 'Turn off water supply before removing any parts.'
      },
      {
        title: 'Fixing Low Water Pressure',
        difficulty: 'Easy',
        time: '10-15 min',
        steps: [
          'Check if issue affects hot, cold, or both',
          'Remove faucet aerator by twisting counterclockwise',
          'Clean any debris or mineral buildup',
          'Soak aerator in vinegar for stubborn deposits',
          'Rinse thoroughly and reinstall',
          'Test water pressure'
        ],
        tools: ['Wrench or pliers', 'White vinegar', 'Old toothbrush'],
        warning: 'If all faucets have low pressure, you may have a main line issue.'
      },
      {
        title: 'Replacing a Shower Head',
        difficulty: 'Easy',
        time: '10-15 min',
        steps: [
          'Remove old shower head by turning counterclockwise',
          'Clean shower arm threads with cloth',
          'Wrap new Teflon tape clockwise around threads',
          'Hand-tighten new shower head onto arm',
          'Use wrench gently if needed for final tightening',
          'Turn on water and check for leaks'
        ],
        tools: ['Adjustable wrench', 'Teflon tape', 'Cloth'],
        warning: 'Don\'t over-tighten as it can crack the shower head or damage threads.'
      }
    ]
  },
  {
    category: 'Electrical',
    icon: Zap,
    color: 'yellow',
    items: [
      {
        title: 'Replacing a Light Switch',
        difficulty: 'Medium',
        time: '15-20 min',
        steps: [
          'Turn off power at the circuit breaker',
          'Use a voltage tester to confirm power is off',
          'Remove the switch plate and unscrew the switch',
          'Disconnect wires and connect them to the new switch',
          'Secure the switch and replace the plate',
          'Turn power back on and test'
        ],
        tools: ['Screwdriver', 'Voltage tester', 'Wire stripper'],
        warning: 'ALWAYS turn off power at the breaker before working with electrical components!'
      },
      {
        title: 'Reset a Tripped Circuit Breaker',
        difficulty: 'Easy',
        time: '5 min',
        steps: [
          'Locate your electrical panel',
          'Find the tripped breaker (usually in middle position)',
          'Unplug devices on that circuit',
          'Push the breaker fully to OFF, then to ON',
          'If it trips again, call an electrician'
        ],
        tools: ['Flashlight (if needed)'],
        warning: 'If breaker trips repeatedly, there may be a serious electrical issue.'
      },
      {
        title: 'Changing a Light Bulb Safely',
        difficulty: 'Easy',
        time: '2-5 min',
        steps: [
          'Turn off the light switch',
          'Wait for bulb to cool if it was recently on',
          'Use a stable ladder if needed',
          'Twist the old bulb counterclockwise to remove',
          'Insert new bulb and twist clockwise until snug',
          'Turn on switch to test'
        ],
        tools: ['Ladder', 'Replacement bulb'],
        warning: 'Never force a stuck bulb - it may break and cause injury.'
      },
      {
        title: 'Installing a Ceiling Fan',
        difficulty: 'Hard',
        time: '1-2 hours',
        steps: [
          'Turn off power at the circuit breaker',
          'Remove existing light fixture',
          'Install ceiling fan mounting bracket',
          'Connect fan wiring following manufacturer instructions',
          'Attach fan motor to mounting bracket',
          'Install fan blades and light kit',
          'Restore power and test operation'
        ],
        tools: ['Screwdriver', 'Wire stripper', 'Voltage tester', 'Ladder'],
        warning: 'This is a complex electrical project. Consider hiring a professional if unsure.'
      },
      {
        title: 'Replacing an Outlet',
        difficulty: 'Medium',
        time: '15-25 min',
        steps: [
          'Turn off power at the circuit breaker',
          'Test outlet with voltage tester to confirm power is off',
          'Remove outlet cover plate',
          'Unscrew outlet from electrical box',
          'Take photo of wire connections before disconnecting',
          'Connect wires to new outlet matching original configuration',
          'Secure outlet and replace cover plate'
        ],
        tools: ['Voltage tester', 'Screwdriver', 'Wire stripper'],
        warning: 'Always verify power is off before touching any wires!'
      }
    ]
  },
  {
    category: 'Carpentry',
    icon: Hammer,
    color: 'orange',
    items: [
      {
        title: 'Fixing a Squeaky Door',
        difficulty: 'Easy',
        time: '5-10 min',
        steps: [
          'Identify which hinge is causing the squeak',
          'Apply lubricant (WD-40 or silicone spray) to the hinge pin',
          'Open and close the door several times',
          'Wipe away excess lubricant',
          'If squeak persists, remove hinge pin and clean it'
        ],
        tools: ['Lubricant spray', 'Clean cloth', 'Hammer (if removing pin)'],
        warning: 'Don\'t over-lubricate as it can attract dust and dirt.'
      },
      {
        title: 'Patching a Hole in Drywall',
        difficulty: 'Medium',
        time: '30-45 min (plus drying time)',
        steps: [
          'Clean the area around the hole',
          'For small holes, apply spackle with a putty knife',
          'For larger holes, use a drywall patch kit',
          'Smooth the surface and let dry completely',
          'Sand lightly and apply a second coat if needed',
          'Prime and paint to match the wall'
        ],
        tools: ['Spackle or joint compound', 'Putty knife', 'Sandpaper', 'Patch kit'],
        warning: 'Allow adequate drying time between coats for best results.'
      },
      {
        title: 'Tightening Loose Cabinet Handles',
        difficulty: 'Easy',
        time: '5 min per handle',
        steps: [
          'Open the cabinet door or drawer',
          'Locate the screw on the inside',
          'Tighten the screw with a screwdriver',
          'If screw won\'t tighten, remove it and add wood glue to hole',
          'Replace screw and let glue dry'
        ],
        tools: ['Screwdriver', 'Wood glue (if needed)'],
        warning: 'Don\'t over-tighten as it can strip the screw hole.'
      },
      {
        title: 'Fixing a Sticking Door',
        difficulty: 'Medium',
        time: '20-30 min',
        steps: [
          'Identify where the door is sticking',
          'Mark the problem area with a pencil',
          'Remove the door from its hinges',
          'Sand or plane the marked area carefully',
          'Test fit the door and adjust as needed',
          'Rehang the door and apply finish if needed'
        ],
        tools: ['Screwdriver', 'Sandpaper or plane', 'Pencil'],
        warning: 'Remove small amounts at a time - you can always remove more but can\'t add it back.'
      },
      {
        title: 'Installing Floating Shelves',
        difficulty: 'Medium',
        time: '30-45 min',
        steps: [
          'Mark the desired shelf position with a level',
          'Locate wall studs using a stud finder',
          'Mark bracket positions and pre-drill holes',
          'Install wall anchors if not mounting to studs',
          'Attach brackets securely to the wall',
          'Slide shelf onto brackets and secure'
        ],
        tools: ['Level', 'Stud finder', 'Drill', 'Wall anchors', 'Screwdriver'],
        warning: 'Ensure brackets are level and properly secured before adding weight.'
      }
    ]
  }
];

export function Tutorials() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section id="tutorials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">DIY Tutorials</h2>
          <p className="text-xl text-gray-600">Learn how to fix common household issues yourself</p>
        </div>

        <div className="space-y-12">
          {tutorials.map((category) => (
            <div key={category.category}>
              <div className="flex items-center mb-6">
                <div className={`${getCategoryColor(category.color)} p-3 rounded-lg mr-4`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{category.category} Tutorials</h3>
              </div>

              <div className="grid gap-6">
                {category.items.map((tutorial, index) => {
                  const itemId = `${category.category}-${index}`;
                  const isExpanded = expandedItems.includes(itemId);

                  return (
                    <div key={itemId} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <h4 className="text-xl font-bold text-gray-900 text-left">{tutorial.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(tutorial.difficulty)}`}>
                            {tutorial.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">⏱ {tutorial.time}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-gray-100">
                          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-red-700">{tutorial.warning}</p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h5 className="font-bold text-gray-900 mb-3">Tools Needed:</h5>
                            <ul className="flex flex-wrap gap-2">
                              {tutorial.tools.map((tool) => (
                                <li key={tool} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                  {tool}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <h5 className="font-bold text-gray-900 mb-3">Step-by-Step Instructions:</h5>
                            <ol className="space-y-3">
                              {tutorial.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start">
                                  <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-gray-700 pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Need professional help?</strong> If this repair seems too complex or you encounter issues, 
                              <a href="#contact" className="text-blue-600 hover:text-blue-700 ml-1 underline">contact FIX&BIN</a> for expert assistance.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Can't Fix It Yourself?</h3>
          <p className="text-lg mb-6">Our professional team is ready to help with any repair, big or small!</p>
          <a 
            href="#contact" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Professional Help
          </a>
        </div>
      </div>
    </section>
  );
}