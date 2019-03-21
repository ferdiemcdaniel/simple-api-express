FROM mhart/alpine-node:8.3

WORKDIR /vader
ADD . .

# set app port
ENV PORT 8080

# expose port
EXPOSE  8080

# start command as per package.json
CMD ["node", "dist"]