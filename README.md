# LNG Cooldown Calculator

The **LNG Cooldown Calculator** is a tool designed to calculate the required cooling duration, flow rates, and liquid volumes for the cooldown process of a cryogenic tank. The calculator takes into account multiple phases of cooling using LIN vapor, liquid LIN, and optional LNG cooling for temperatures below -160°C.

## Features

- **Customizable Tank Inputs:**
  - Provide tank dimensions (height, diameter, thickness) or input the tank volume and weight directly.
  - Choose from a dropdown of tank materials with predefined properties for heat capacity and density.
  
- **Cooling Process Simulation:**
  - **Phase 1: LIN Vapor Precooling** to cool the tank from its initial temperature down to -120°C.
  - **Phase 2: LIN Cooling** from -120°C to -160°C using liquid LIN.
  - **Phase 3: LNG Cooling** (optional) for temperatures below -160°C.
  
- **Automatic Calculations:**
  - Calculates tank mass if not provided, based on geometry and material density.
  - Computes the energy required for each cooling phase using the latent heat and heat capacity of materials.
  - Outputs total LIN vapor and LIN volumes required for the cooldown process.

- **Flow Rate and Duration Control:**
  - Adjustable cooling rate to control how fast the tank cools in °C/hr.
  - Ensures the actual cooling rate is within limits to avoid overshooting.
  - Calculates total hours/days for each cooling phase and the overall process.

- **Contingency Planning:**
  - Final liquid volumes include a user-defined contingency factor for safety.

## How to Use

1. **Access the Calculator:**
   - Click the deployment link to access the calculator: [LNG Cooldown Calculator](https://takeonoda.github.io/lng-cd-est/).

2. **Input Parameters:**
   - Enter the tank dimensions (or volume/weight) and material properties.
   - Set the initial and target temperature, and define the cooling rate.
   - Enter the LIN vapor and liquid flow rates for each cooling phase.
   
3. **Run the Calculation:**
   - The calculator will determine the cooling duration, flow rates, and liquid volumes required for each cooling phase.
   - Total hours for the process, including LIN volumes with contingency, will be displayed.

4. **Review Results:**
   - Detailed output includes cooling time breakdown, required LIN/LNG volumes, and final LIN volume with contingency.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/takeonoda/lng-cd-est.git
