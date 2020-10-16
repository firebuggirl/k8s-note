FROM node:13.11.0-slim
COPY . .
RUN npm install
CMD [ "node", "index.js" ]

# docker build -t knote .
