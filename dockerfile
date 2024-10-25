FROM node:20

ENV PORT 5173

# Create app directory
RUN mkdir -p /emedicoz-website-new
WORKDIR /emedicoz-website-new

# Installing dependencies
COPY package*.json /emedicoz-website-new/
RUN npm install
#RUN npm run dev
# Copying source files
COPY . /emedicoz-website-new

# Building app
#RUN npm run build
EXPOSE 5173

##RUN npm run dev -- --host
# Running the app
##CMD ["npm", "run", "dev"]  
CMD ["npm", "run", "dev", "--", "--host"]