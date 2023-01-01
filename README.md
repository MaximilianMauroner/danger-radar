# Danger Radar scuffed documentation

## What is this? (ChatGPT summary)

An app that aims to protect women when they return home could have a variety of interesting and useful features. Some
potential features could include the following:

- GPS tracking: This could allow friends, family members, or other trusted individuals to monitor the user's location in
  real time and ensure that they are safe as they make their way home.
- Panic button: This could allow the user to quickly and easily send a distress signal to designated contacts in the
  event of an emergency.
- Safe routes: The app could provide the user with a range of safe routes to choose from when traveling home, taking
  into account factors such as lighting, traffic, and potential hazards.
- Self-defense tips and techniques: The app could provide the user with information and guidance on how to defend
  themselves in a variety of situations, such as how to escape a choke hold or how to effectively use pepper spray.
- Connections to local law enforcement: The app could allow the user to quickly and easily connect with local law
  enforcement agencies in the event of an emergency, providing them with a direct line of communication to help ensure
  their safety.

Overall, an app like this could be a valuable tool for women who are concerned about their safety when traveling home,
providing them with a range of features and resources to help protect them and keep them safe.

### My Basic Idea

- map of dangerous places
    - with comments from people
    - radius of danger
    - time of danger
    - (maybe news regarding danger/sources)
- emergency contact list with location data
    - emergency police call
        - check if there is a way to send police the information data
- insert place and the least dangerous route will be found

## Todo

- [ ] Add more documentation
- [ ] implement better modal
- [ ] time selector for danger radar
- [ ] emergency sharing functionality
- [ ] location tracking functionality
- [ ] street name and pathfinder
- [ ] danger point slider
- [ ] positive points with annotations e.g. "safe place" or "good lighting"

## Technologies

- Language: TS with Next.js
- UI and Styling: TailwindCSS with Flowbite
- Database: Self hosted MySQL maybe Planetscale later
- Boilerplate: Create-T3-App
- Auth: Next-Auth
- Hosting: Vercel
- Map Provider: Leaflet
- Websocket Provider: TODO