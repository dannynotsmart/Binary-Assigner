# Binary Assigner

Binary Assigner is a tool designed to digitalize the assignment of binary values. Allows you to assign two different values to a numbered list. Meant to be used alongside a clicker and the website for visualization.

Sample website usage can be seen at 
https://binary-assigner.vercel.app/ and https://binary-assigner.vercel.app/view

# Features
This repository was originally developed to monitor wells on a well plate within a laboratory environment between two binary states. However, the applications extend beyond this and are useful for anything you need to track the state of. As this was developed alongside a clicker, controls that are mentioned are assuming that you have the clicker (https://www.amazon.com/gp/product/B09X1G5DCC/ref=ox_sc_act_title_1?smid=A3JAW9CCBGOOEH&psc=1). Current features include:

- Export as a JSON file
- Set how many binary states you want to track through adjusting the dimensions of the array
- Exports the data in a JSON file
- Import JSON files to modify existing save states
- "<-" and "->" keys to cycle between wells
- "B" or "" to toggle the state of the well
- "B" (Keyboard) or "Action Button" (Clicker) to toggle the state of the well

# Installation
Prerequisites
Node.js >= 14.x
Installation can be done by cloning the github repoistory (git clone https://github.com/dannynotsmart/Binary-Assigner)

## Contributing
We welcome contributions to the Binary Assigner project! If you'd like to contribute, please fork the repository and use a feature branch.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
