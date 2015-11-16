#add tvheadend 
FROM phusion/baseimage:0.9.17
MAINTAINER pscherrer80 <pscherrer80@gmail.com>
ENV DEBIAN_FRONTEND noninteractive

# Set correct environment variables
ENV HOME /root

# Use baseimage-docker's init system
CMD ["/sbin/my_init"]

#Change uid & gid to match Unraid
RUN usermod -u 99 nobody && \
    usermod -g 100 nobody

# Install dependencies, build and install tvheadend
RUN apt-get update -qq && \
apt-get install -qy \
build-essential pkg-config libssl-dev git bzip2 wget \
libavahi-client-dev zlib1g-dev libcurl4-gnutls-dev python \
liburiparser1 liburiparser-dev gettext \
libhdhomerun-dev dvb-apps && \
cd /tmp && git clone https://github.com/tvheadend/tvheadend.git && cd tvheadend && \
git checkout 82776a4 && ./configure --enable-libffmpeg_static && make && make install && \
rm -r /tmp/tvheadend && apt-get purge -qq build-essential pkg-config git && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 9981 9982

VOLUME /config \
       /recordings \
	   /data

#Start tvheadend when container starts
RUN mkdir -p /etc/service/tvheadend
ADD tvheadend /etc/service/tvheadend/run
RUN chmod +x /etc/service/tvheadend/run

#Add ffmpeg to /usr/bin/
ADD ffmpeg.gz /usr/bin

#Add ffpipe.sh to /usr/local/bin/
ADD ffpipe.sh /usr/local/bin/

#Add XMLTV to use other grabber
#Use mythbuntu repo 'cause ubuntu repo is to old
RUN add-apt-repository "deb http://us.archive.ubuntu.com/ubuntu/ precise main universe"
RUN apt-get update -qq
RUN apt-get install -qy xmltv

#Add basic configuration for German Astra/Hotbird Channels
#ADD config /config/
