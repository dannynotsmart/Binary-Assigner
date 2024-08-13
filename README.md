# Binary Assigner

Watch the tutorial / demo of this website [here](https://youtu.be/iQprJXyiMOo).

This project provides a simple web interface to control the states of individual wells on a well plate. The user can toggle the state of each well between two states. This is mainly designed to be used with a wireless presenter or a keyboard. The well plate is typically used in laboratory settings, and this interface helps record the state of wells in a user-friendly manner, especially when the user is using a microscope and cannot see the data on the screen.  

https://binary-assigner.vercel.app/

## Features: 
- Set the dimensions of the well plate, with letters to identify rows and numbers to identify columns
- Add description about the specimens in the well plate
- "<-" (only on keyboard) and "->" keys to cycle between wells
- "B" (Keyboard) or "page up button" (Clicker) to toggle the state of the well to blue
- "N" (keyboard) or "<-"(clicker) to toggle between red and green for the well
- When well state is toggled from default, cycles to next well
- Exports the data in a JSON file
- Import JSON files to modify existing save states

https://binary-assigner.vercel.app/view
- Import the JSON file to view well plate assignments

Clicker used in project: https://www.amazon.com/gp/product/B09X1G5DCC

## Technical Details

Project was made in TypeScript using Next.JS. The project is licensed [here](./LICENSE.txt)

Thanks to [JoKhannn](https://github.com/JoKhannn) for the README!